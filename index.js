const session = require("express-session")
const express = require("express");



const mysql = require("mysql");

const config = require("./db/config");

const { getSessionUser } = require("./controllers/auth");
const routesManager = require("./routes");

const db = mysql.createConnection(config);

db.connect(async function (err) {
  if (err) {
    throw "App could not connect to the DB. Stopping...";
  }

  const app = express();

  // Set up view engine
  app.set('view engine', 'pug');
  app.set('views', __dirname + '/views');
  // STATIC FILES served from /public
app.use(express.static(__dirname + '/public'));

  // Register middlewares
  app.use(express.urlencoded({ extended: true })); // parse POST data
app.use(function(req, res, next) {
  req.con = db
  next()
})
app.use(session({
    secret: "test",
    resave: true,
    saveUninitialized: true
}))
  
  
  app.use((req, res, next)=>{
    res.locals.currentUser = req.session.user
    
  next()
})


  // Register routes
  routesManager(app);

  app.listen(process.env.PORT || 5000);
});
