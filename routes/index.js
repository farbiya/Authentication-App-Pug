const auth = require("../controllers/auth");
const { requireAuth, setAuthToken, unsetAuthToken } = require("../controllers/auth");
const { User, Schedule } = require("../db/models");
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

module.exports = (app) => {
  app.get("/", requireAuth, (req, res) => {
    
    
  });

  app.get("/login", requireAuth, (req, res) => {
    
   
    res.render("login",{title:'login'});
  });

  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = auth.getHashedPassword(req.body.password) 
    if (email && password)
      User.getUser(req.con, [email, password], (error, rows) => {
        if (rows.length > 0) {
          auth.setAuthToken(rows[0].user_id, req, res)
          res.redirect('/home')
        }
          
        else
          res.render("login")
      })
  });
  
  app.get("/home",requireAuth, (req, res) => {
    Schedule.getSchedule(req.con, (error, rows) => {
      if (error) {
                
        
        res.render('home', { data: [] });
      } else {
           
        res.render('home', { data: rows, days, title: "Home" });
      }
    })
  });

  app.get("/logout", (req, res) => {
    if (req.session) {
      // Delete the session object
      req.session.destroy((err) => {
        if (err) { return next(err) }
        else { return res.redirect('/login') }
      })
    }
  });

  app.get("/signup", (req, res) => {
    res.render("signup", { title:'Signup'});
  });

  app.post("/signup", (req, res) => {
   
    User.postUserDetails(req.con,(error, rows) => {
        if (req.body.surname &&
      req.body.firstname &&
      req.body.email &&
      req.body.password &&
      req.body.confirmPassword) {
        // Confirm user entered two matching passwords
        if (req.body.password !== req.body.confirmPassword) { 
          res.render("signup",{ error:'Both passwords must match.' })
        } else {
          
          const userData = req.body;
          delete userData['confirmPassword']
          
          userData.password=auth.getHashedPassword(userData.password)
            User.postUserDetails(req.con, userData, (error, rows) => {
              if (error) {
              if (error.code === "ER_DUP_ENTRY") 
                  res.render('signup', { error: 'Email is taken' });
              else
                return next(error)
            } else {
              
              return res.redirect('/login')
            } 
          })
      }
  } else { 
      res.render("signup", {error: "Fill the forms"})
  }
    })

  });

  app.get("/user/:user_id", requireAuth, (req, res) => {
    
     Schedule.getUserSchedule(req.con, req.params.user_id, (error, schedules) => {
      
     res.render('user', {
        schedules,
        days,
        title: "user details"
    });
   });
   
  });

  app.get("/schedule", requireAuth, (req, res) => {
   
    Schedule.getUserSchedule(req.con, req.session.user.user, (error, schedules) => {
      
     res.render('schedule', {
       schedules,
        days,
        title: "Add New Schedule"
    });
   })
    
  });

  app.get('/delete/:id',requireAuth, (req, res)=> {



    let id = req.params.id;
     
    Schedule.deleteSchedule(req.con, id, (err, result) => {
      Schedule.getUserSchedule(req.con, req.session.user.user, (error, schedules) => {
      
     //if(err) throw err
        if (err) {
           
            
            // redirect to schedules page
          res.render('schedule', { error:err,schedules,days})
        } else {
            
           
            // redirect to schedules page
            res.render('schedule',{success:'schedule successfully deleted! ID = ' + id,schedules,days})
        }
   })


       
    })
})


  
    
 

  app.post("/schedule", (req, res) => {
    // todo
    let schedules = []

    Schedule.getUserSchedule(req.con, req.session.user.user, (error, rows) => {
      
     schedules = rows
   })

    let day = req.body.day;
    let start_time = req.body.start_time;
    let end_time = req.body.end_time;
    let errors = false;

    if( day.length === 0 || start_time.length == 0 || end_time.length == 0 ) {
        errors = true;

       
        
        
        res.render('schedule', {
          day: day,
          start_time: start_time,
          end_time: end_time, days,
          error:"Please enter details",
            schedules,days,
        })
    }

   
    if(!errors) {

        var form_data = {
          user_id: req.session.user.user,
          day: day,
          start_time: start_time,
          end_time:end_time
        }
        
        
        Schedule.postSchedule(req.con, form_data, (error, rows) => {
            
            if (error) {
               
                 
                
                res.render('schedule', {
                 schedules,
                  day: form_data.day,
                  start_time: form_data.start_time,
                  end_time: form_data.end_time, days,
                  error,days,

                })
            } else {                
               Schedule.getUserSchedule(req.con, req.session.user.user, (error, rows) => {
      
      res.render('schedule',{success:"Schedule successfully added",schedules: rows, days,});
   })
               
            }
        })
    }
  });
};
