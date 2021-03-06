const db = require("../models");
const passport = require("../config/passport");

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.render("login");
  });

  app.get("/signup", (req, res) => {
    res.render("signup");
  });
  // if the user has valid login credentials, send them to index page, otherwise send them the err message
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    console.log("login post route");
    // console.log("passing login data", req);
    res.json(req.user);
    // db.Characters.findAll({});
  });

  // route for signing up a user. user's password is auto hashed and stored securely bc of how we configured our sequelize user model. if user created successfully, proceed to log the user in, otherwise send error
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    }).then(function (data) {
      db.Character.create({
        name: req.body.name,
        health: 100,
        attack: 10,
        image: req.body.image,
        UserId: data.id,
      }).then(function (userInfo) {
        const id = userInfo.dataValues.UserId;
        //res.redirect("/harryapp/" + id);
        res.json({ id });
      });
    });
    // .catch(function (err) {
    //   res.status(401).json(err);
    // });
  });
  app.get("/api/character/", function (req, res) {
    db.Character.findAll({}).then(function (dbCharacter) {
      res.json(dbCharacter);
    });
  });

  // get user info from UserId then render character info to handlebars
  app.get("/harryapp/:id", function (req, res) {
    db.Character.findAll({
      where: {
        UserId: req.params.id,
      },
    }).then(function (dbCharacter) {
      console.log(dbCharacter);
      let character = {
        name: dbCharacter[0].name,
        health: dbCharacter[0].health,
        attack: dbCharacter[0].attack,
        image: dbCharacter[0].image,
      };
      // comment to commit
      res.render("index", { character });
    });
  });
  // route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  // route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // user is not logged in, send back empty obj
      res.json({});
    } else {
      // otherwise send back the user's email and id and username, dont send back a pw
      res.json({
        email: req.user.email,
        username: req.user.username,
        id: req.user.id,
      });
    }
  });

  app.get("/signup", function (req, res) {
    res.sendFile(path.join(__dirname, "/signup"));
  });

  // add a new character
  app.post("/api/character/", function (req, res) {
    console.log(req.name);
    db.Character.create({
      name: req.body.name,
    }).then(function (dbCharacter) {
      res.json(dbCharacter);
    });
  });

  //Delete User
  app.delete("/api/user/:id", function (req, res) {
    db.User.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // think it needs to be /harryapp/:id
  // app.put("/harryapp/:id", (req, res) => {
  //   db.Character.

  //   .then(function (dbUser) {
  //     res.render("index", { character });
  //   });

  //   .find({ where : { UserId: req.params.id}}).on("",(data)=>{ if(data){
  //   Character.update({
  //   health: character.health
  //   })
  //   }})

  //   .update({ health: userCharacter.health,}, { where: { UserId: req.params.id },})

  // });
};
