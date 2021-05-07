const { setAuthToken, getHashedPassword } = require("../controllers/auth");

module.exports.User = {
  // function 1: call to ddQBN2SWSWSGT W to get user info by passing their id
  
  // function 2: auth the user (for login)
  getUser: (con, parameter, callback) => {
       con.query('SELECT * FROM users WHERE email = ? AND password = ?', parameter, callback)
    },
  
  // function 3: validate a new sign-up
  postUserDetails: (con, parameter, callback) => {        
       return con.query('INSERT INTO users SET ?', parameter, callback)
    }
};

module.exports.Schedule = {
  // function 1: get all schedules
  getSchedule: (con, callback) => {        
       con.query('SELECT * FROM `schedule` s LEFT JOIN `users` u ON u.user_id = s.user_id ', callback)
  },
  // function 2: create new schedule entry
  postSchedule: (con, parameter, callback) => {
   return con.query('INSERT INTO schedule SET ?', parameter,callback)
  },
  // function 3: get all schedules for logged in user
  getUserSchedule: (con, user_id, callback) => {
   return con.query('SELECT * FROM `schedule` s LEFT JOIN `users` u ON u.user_id = s.user_id where s.user_id=?', user_id,callback)
  },
  deleteSchedule: (con, schedule_id, callback) => {
    return con.query('DELETE FROM schedule WHERE schedule_id = ?',schedule_id, callback)
  }
  
};