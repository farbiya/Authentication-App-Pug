const crypto = require("crypto");
// we store the tokens in-memory for simplicity's sake
// in production we'd make them persistent
const authTokens = {};

const generateAuthToken = () => {
 return crypto.randomBytes(30).toString('hex');
};

module.exports = {
  setAuthToken: (userId,req,  res) => {
    req.session.user = {
      token: generateAuthToken(),
            loggedIn: true,
            user: userId       
          }
    // todo
  },

  unsetAuthToken: (req, res) => {
    // todo
  },

  getSessionUser: (req, res, next) => {
    return req.session.user

    // todo
  },

  requireAuth: (req, res, next) => {
    const user = req.session.user
    if (user && user.loggedIn) {
      // res.render("home")
      next()
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
  },




  getHashedPassword: (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('hex');
    return hash;
  },
};