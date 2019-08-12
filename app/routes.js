module.exports = function(app, passport, db, ObjectId) {

  // normal routes ===============================================================

    // HOMEPAGE SECTION =========================
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });


  // MAIN SECTION =========================
  app.get('/main', isLoggedIn, function(req, res) {
    var uId = ObjectId(req.session.passport.user)
    var uName
    db.collection('users').find({"_id": uId}).toArray((err, result) => {
      if (err) return console.log(err)
      uName = result[0].local.name
      db.collection('main').find({"name": uName}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('main.ejs', {
          user : req.user,
          main: result
        })
      })
    });
  });

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  date = mm + '/' + dd + '/' + yyyy;

//POST goals to database
  app.post('/goals', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    var uName
    db.collection('users').find({
      "_id": uId
    }).toArray((err, result) => {
      if (err) return console.log(err)
      uName = result[0].local.name
      db.collection('main').save({
        name: uName,
        date: date,
        goal1: req.body.goal1,
        g1done: false,
        time1: req.body.time1,
        why1: req.body.why1,
        goal2: req.body.goal2,
        g2done: false,
        time2: req.body.time2,
        why2: req.body.why2,
        goal3: req.body.goal3,
        g3done: false,
        time3: req.body.time3,
        why3: req.body.why3,
        archived: false
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/main')
      })
    })
  })

//DELETE GOALS
  app.delete('/deletePost', (req, res) => {
    db.collection('main').findOneAndDelete({
      date: date
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

//MARK GOALS AS COMPLETED
  app.put('/g1Done', (req, res) => {
    db.collection('main')
    .findOneAndUpdate({date: req.body.date, goal1: req.body.goal1 }, {
      $set: {
        'g1done': true
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  app.put('/g2Done', (req, res) => {
    db.collection('main')
    .findOneAndUpdate({date: req.body.date, goal2: req.body.goal2 }, {
      $set: {
        'g2done': true
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  app.put('/g3Done', (req, res) => {
    db.collection('main')
    .findOneAndUpdate({date: req.body.date, goal3: req.body.goal3 }, {
      $set: {
        'g3done': true
      }
    }, {
      sort: {_id: -1},
      upsert: false
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })


  // PROFILE SECTION =========================

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
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/main', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

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
