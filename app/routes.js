module.exports = function(app, passport, db, multer, ObjectId, Nexmo) {

  // normal routes ===============================================================

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var date = mm + '/' + dd + '/' + yyyy;

  var hr = today.getHours()
  if (hr > 12) {
    hr = hr - 12
  } else if (hr === 0) {
    hr = 12
  } else if (hr < 10) {
    hr = '0' + hr
  }

  var mins = today.getMinutes()
  if (mins < 10) {
    mins = '0' + mins
  }

  var ampm = (today.getHours()) < 12 ? 'AM' : 'PM';
  var time = hr.toString() + ':' + mins + ampm

  // HOMEPAGE =========================
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // MAIN GOALS PAGE =========================
  app.get('/main', function(req, res) {
    var uId = ObjectId(req.session.passport.user)
    db.collection('main').find({
      "userId": uId
    }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('main.ejs', {
        user: req.user,
        main: result
      })
    })
  });

  //---------------------------------------
  // IMAGE CODE
  //---------------------------------------
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
  });
  var upload = multer({
    storage: storage
  });

  app.post('/uploadProPic', upload.single('file-to-upload'), (req, res, next) => {
    insertDocuments(db, req, 'images/uploads/' + req.file.filename, () => {
      res.redirect('/main')
    });
  });

  var insertDocuments = function(db, req, filePath, callback) {
    var collection = db.collection('users');
    var uId = ObjectId(req.session.passport.user)
    collection.findOneAndUpdate({
      "_id": uId
    }, {
      $set: {
        "local.imageUrl": filePath
      }
    }, {
      sort: {
        _id: -1
      },
      upsert: false
    }, (err, result) => {
      if (err) return res.send(err)
      callback(result)
    })
  }

  //EDIT user info

  app.put('/saveUserInfo', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    db.collection('users')
      .findOneAndUpdate({
        "_id": uId
      }, {
        $set: {
          'local.username': req.body.username,
          'local.number': req.body.number,
          'local.optIn': req.body.optIn,
          'local.email': req.body.email
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  //POST goals to database
  app.post('/goals', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    var name
    var uName
    db.collection('users').find({
      "_id": uId
    }).toArray((err, result) => {
      if (err) return console.log(err)
      name = result[0].local.name
      username = result[0].local.username
      db.collection('main').save({
        name: name,
        username: username,
        userId: uId,
        date: date,
        goal1: req.body.goal1,
        why1: req.body.why1,
        time1: req.body.time1,
        g1Count: 0,

        goal2: req.body.goal2,
        why2: req.body.why2,
        time2: req.body.time2,
        g2Count: 0,

        goal3: req.body.goal3,
        why3: req.body.why3,
        time3: req.body.time3,
        g3Count: 0
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/main')
      })
    })
  })

  //MARK GOALS AS COMPLETED
  app.put('/g1Done', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    db.collection('main')
      .findOneAndUpdate({
        userId: uId,
        date: req.body.date,
        goal1: req.body.goal1
      }, {
        $set: {
          'g1Count': req.body.g1Count + 1
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/g2Done', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    db.collection('main')
      .findOneAndUpdate({
        userId: uId,
        date: req.body.date,
        goal2: req.body.goal2
      }, {
        $set: {
          'g2Count': req.body.g2Count + 1
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/g3Done', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    db.collection('main')
      .findOneAndUpdate({
        userId: uId,
        date: req.body.date,
        goal3: req.body.goal3
      }, {
        $set: {
          'g3Count': req.body.g3Count + 1
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  //DELETE GOALS
  app.delete('/deleteGoal', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    db.collection('main').findOneAndDelete({
      userId: uId,
      date: req.body.date,
      goal1: req.body.goal1,
      goal2: req.body.goal2,
      goal3: req.body.goal3
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })


  // FEED PAGE ====================
  app.get('/feed', isLoggedIn, function(req, res) {
    db.collection('feed').find({
      // for reference for later page (find by querying username)
    }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('feed.ejs', {
        user: req.user,
        feed: result
      })
    })
  });

  app.get('/favorites', isLoggedIn, function(req, res) {
    db.collection('feed').find({
      // for reference for later page (find by querying username)
    }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('favorites.ejs', {
        user: req.user,
        feed: result
      })
    })
  });

  app.post('/sendComment', isLoggedIn, function(req, res) {
    var currentUser = req.body.currentUser
    var userPosted = req.body.userPosted
    var userPostedNum
    var comment = `Love from @${currentUser}:
- ${req.body.comment}

replied to: "${req.body.feedMsg}"`

    db.collection('users').find({
      "local.username": userPosted
    }).toArray((err, result) => {
      if (err) return console.log(err)
      userPostedNum = '1' + result[0].local.number

      nexmo.message.sendSms(
        '19592065428', userPostedNum, comment, {
          type: 'unicode'
        },
        (err, result) => {
          if (err) return console.log(err)
          console.log('sent text')
        })
    })
  });

  app.put('/updateComment', (req, res) => {
    db.collection('feed')
      .findOneAndUpdate({
        userPosted: req.body.userPosted,
        feedMsg: req.body.feedMsg,
        feedDate: req.body.feedDate
      }, {
        $addToSet: {
          comments: [req.body.currentUser, req.body.comment]
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.post('/postFromHome', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    var uName
    var proPic
    db.collection('users').find({
      "_id": uId
    }).toArray((err, result) => {
      if (err) return console.log(err)
      uName = result[0].local.username
      proPic = result[0].local.imageUrl
      db.collection('feed').save({
        userPostedId: uId,
        userPosted: uName,
        userProPic: proPic,
        feedMsg: req.body.feedMsg,
        feedDate: date + ' ' + time,
        favoritedBy: [],
        comments: []
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/main')
      })
    })
  })

  app.post('/postFromFeed', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    var uName
    var proPic
    db.collection('users').find({
      "_id": uId
    }).toArray((err, result) => {
      if (err) return console.log(err)
      uName = result[0].local.username
      proPic = result[0].local.imageUrl
      db.collection('feed').save({
        userPostedId: uId,
        userPosted: uName,
        userProPic: proPic,
        feedMsg: req.body.feedMsg,
        feedDate: date + ' ' + time,
        favoritedBy: [],
        comments: []
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/feed')
      })
    })
  })

  app.put('/favorited', (req, res) => {
    db.collection('feed')
      .findOneAndUpdate({
        userPosted: req.body.userPosted,
        feedDate: req.body.feedDate,
        feedMsg: req.body.feedMsg
      }, {
        $addToSet: {
          favoritedBy: req.body.currentUser
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/deletePost', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    db.collection('feed').findOneAndDelete({
      userPosted: req.body.userPosted,
      feedDate: req.body.feedDate,
      feedMsg: req.body.feedMsg
    }, {}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })


  // ARCHIVE PAGE ====================
  app.get('/archive', isLoggedIn, function(req, res) {
    var uId = ObjectId(req.session.passport.user)
    db.collection('main').find({
      "userId": uId
    }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('archive.ejs', {
        user: req.user,
        main: result
      })
    })
  });

  // USER PAGE ====================

  app.get('/user/:username', isLoggedIn, function(req, res) {
    var username = req.params.username
    db.collection('feed').find({
      "userPosted": username
    }).toArray((err, result) => {
      db.collection('users').find({
        "local.username": username
      }).toArray((err, userResult) => {
        console.log(userResult);
        db.collection('main').find({
          "username": username
        }).toArray((err, mainResult) => {
          console.log(mainResult);
          if (err) return console.log(err)
          res.render('user.ejs', {
            user: userResult,
            feed: result,
            main: mainResult
          })
        })
      })
    })
  });



  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/main', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/main', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    }));

  // NEXMO SMS CODE =========================
  // Init NEXMO
  const nexmo = new Nexmo({
    apiKey: '1a7cfdf4',
    apiSecret: 'aw6J8A0qDqt579Xo'
  })

  //send text reminders to users
  app.post('/textGoal1', (req, res) => {
    res.send(req.body);
    const number = req.body.number
    const msg = req.body.msg

    nexmo.message.sendSms(
      '19592065428', number, msg, {
        type: 'unicode'
      },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
      })
  });

  app.post('/textGoal2', (req, res) => {
    res.send(req.body);
    const number = req.body.number
    const msg = req.body.msg

    nexmo.message.sendSms(
      '19592065428', number, msg, {
        type: 'unicode'
      },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
      })
  });

  app.post('/textGoal3', (req, res) => {
    res.send(req.body);
    const number = req.body.number
    const msg = req.body.msg

    nexmo.message.sendSms(
      '19592065428', number, msg, {
        type: 'unicode'
      },
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
      })
  });


  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/main');
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
