const passport = require('passport')
const mysql = require('mysql')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')

const connection = require('../database/index')
const keys = require('../config/keys')

//set up serialize/deserialize and configure each strategy through passport.use. nothing is exported

passport.serializeUser((user,done)=>{
    done(null, user.id)
})

// //done is called with(err, user)
passport.deserializeUser((id,done)=>{
    const sql = `SELECT * FROM users WHERE id=${id}`
    connection.query(sql, (err, results)=>{
        done(err,results[0])
    })
    // done(null,false) //run this to remove user cookie if database is reset and 'failed to deserialize user' error occurs
})

//config local strategy - first arg is the verify callback
passport.use(new LocalStrategy(
    (username, password, done)=>{
        connection.query(`SELECT * FROM users WHERE username="${username}"`, (err, rows)=>{
            //if db error
            if(err) return done(err)
            //if user doesn't exit
            if(!rows.length){
                return done(null, false, {message: 'Incorrect Username'})
            }
            //compare passwords
            bcrypt.compare(password, rows[0].password, (err,res)=>{
                if(err) return done(err)
                //res is true if passwords match
                if(res){
                    return done(null, rows[0]) //return user if passwords math
                }
                //else password was incorrect
                else {
                    return done(null, false, {message: 'Incorrect Password'})
                }
            })
            // //if pw is wrong
            // if(rows[0].password!==password){
            //     return done(null, false, {message: 'Incorrect Password'})
            // }
            // //else return user
            // else return done(null, rows[0])
        })
    }
))

//config google strategy - first arg is config object, second is verify callback
passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true //used for proxying through heroku or wherever deployed
    }, (accessToken, refreshToken, profile, done) => { //the verify callback. end with done(err, user)
        //either find or create user
        connection.query(`SELECT * FROM users WHERE google_id=${profile.id}`,(err,rows)=>{
            //if db error
            if(err) return done(err, null)
            //if user exists
            if(rows.length) return done(null, rows[0])
            //if user does not exist, then create
            if(!rows.length){
                connection.query(`INSERT INTO users(google_id, first_name, last_name, photo, email) VALUES("${profile.id}", "${profile.name.givenName}", "${profile.name.familyName}", "${profile.photos[0].value}", "${profile.emails[0].value}")`, (err,rows)=>{
                    if(err) return done(err,null)
                    //now that user is created, fetch the user record and pass it to done()
                    connection.query(`SELECT * FROM users WHERE google_id=${profile.id}`,(err,rows)=>{
                        if(err) return done(err,null)
                        return done(null, rows[0])
                    })
                })
            }
        })
    }
))

// config facebook strategy
passport.use(new FacebookStrategy({
    clientID: keys.facebookAppId,
    clientSecret: keys.facebookSecret,
    callbackURL: '/auth/facebook/callback',
    proxy: true,
    fields: ['id', 'displayName', 'name', 'picture.type(large)', 'email']
}, (accessToken, refreshToken, profile, done)=>{
    //either find or create user
    connection.query(`SELECT * FROM users WHERE facebook_id=${profile.id}`, (err,rows)=>{
        //if db err
        if(err) return done(err, null)
        //if user exists
        if(rows.length) return done(null, rows[0])
        //if user does not exist, then create
        if(!rows.length){
            connection.query(`INSERT INTO users(facebook_id) VALUES("${profile.id}")`, (err,rows)=>{
                if(err) return done(err,null)
                //now that user is created, fetch the user record and pass it to done()
                connection.query(`SELECT * FROM users WHERE facebook_id=${profile.id}`,(err,rows)=>{
                    if(err) return done(err,null)
                    return done(null, rows[0])
                })
            })
        }
    })
}))