const passport = require('passport')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')

const connection = require('../database/index')

//set up auth routes - two get routes for each oauth (initial and callback), two post routes for local (signup and login) logout, and show current user

module.exports = app => {
    //return current user. the full user model is stored on req.user
    app.get('/auth/current_user',(req,res)=>{
        //remove hashed password from object before sending it
        if (req.user && req.user.password) delete req.user['password']
        
        res.send(req.user)
    })

    //logs user out
    app.get('/auth/logout',(req,res)=>{
        req.logout();
        res.redirect('/')
    })

    //signs a new user up to use local auth
    app.post('/auth/signup', bodyParser.urlencoded({extended:false}), (req,res)=>{
        //check if username exists
        connection.query(`SELECT * FROM users WHERE username="${req.body.username}"`,(err, rows)=>{
            if(err) throw err
            //if username exists send message
            if(rows.length===1){
                res.send({errorMessage: 'Username already exists. Please try again.'})
            //else add user to database
            }else{
                //generate salt and hash password, then insert into db
                bcrypt.hash(req.body.password, null, null, (error,hash)=>{ //10 salt rounds. hash is hashed pw
                    if(error) return next(error)
                    //insert into db
                    connection.query(`INSERT INTO users(username, password, first_name) VALUES("${req.body.username}","${hash}","${req.body.firstName}")`,(err,rows)=>{
                        if(err) throw err
                        //create a user to pass to the login function, which needs id to be serialized
                        let user = {}
                        user.id = rows.insertId //.insertId is the last id to be added to the table
                        req.login(user, (err)=>{ //this will add user to req.user
                            if(err) return err
                            else return res.redirect('/')
                        }) 
                    })
                })
            }
        })

    })

    //local auth
    app.post('/auth/login', bodyParser.urlencoded({extended:false}), passport.authenticate('local',{successRedirect:'/', failureRedirect:'/failedLogin'}))

    //step 1 for google oauth. this route triggers the google strategy to start and prompts the user to grant permission use google acct
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))

    //step 2 for google oauth. this is where google redirects to after user grants permission. google strategy is configured in services/passport.js file
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res)=>{res.redirect('/')})

    //step 1 for facebook oauth
    app.get('/auth/facebook', passport.authenticate('facebook'))

    //step 2 for facebook oauth
    app.get('/auth/facebook/callback', passport.authenticate('facebook'), (req,res)=>{res.redirect('/')})

    app.get('/auth/twitter', passport.authenticate('twitter')) //step 1 - redirects user to twitter

    app.get('/auth/twitter/callback', passport.authenticate('twitter'), (req, res)=>{res.redirect('/')}) 
}