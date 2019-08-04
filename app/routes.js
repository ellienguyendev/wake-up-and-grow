module.exports = function(app, passport, db) {

  // normal routes ===============================================================

    // HOMEPAGE SECTION =========================
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });


  // MAIN SECTION =========================
  app.get('/main', isLoggedIn, function(req, res) {
    db.collection('main').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('main.ejs', {
        user: req.user,
        main: result
      })
    })
  });

  app.post('/goals', (req, res) => {
    db.collection('main').save({
      goal1: req.body.goal1,
      time1: req.body.time1,
      goal2: req.body.goal2,
      time2: req.body.time2,
      goal3: req.body.goal3,
      time3: req.body.time3
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })


  // AFFIRMATIONS SECTION =========================

  // NOTES SECTION =========================

  // PROFILE SECTION =========================

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================


  //
  // app.put('/finalProject', (req, res) => {
  //   db.collection('finalProject')
  //     .findOneAndUpdate({
  //       name: req.body.name,
  //       msg: req.body.msg
  //     }, {
  //       $set: {
  //         thumbUp: req.body.thumbUp + 1
  //       }
  //     }, {
  //       sort: {
  //         _id: -1
  //       },
  //       upsert: true
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })
  // })
  //
  // app.put('/finalProjectDown', (req, res) => {
  //   db.collection('finalProject')
  //     .findOneAndUpdate({
  //       name: req.body.name,
  //       msg: req.body.msg
  //     }, {
  //       $set: {
  //         thumbDown: req.body.thumbDown + 1
  //       }
  //     }, {
  //       sort: {
  //         _id: -1
  //       },
  //       upsert: true
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })
  // })
  //
  // app.delete('/finalProject', (req, res) => {
  //   db.collection('finalProject').findOneAndDelete({
  //     name: req.body.name,
  //     msg: req.body.msg
  //   }, (err, result) => {
  //     if (err) return res.send(500, err)
  //     res.send('Message deleted!')
  //   })
  // })

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
