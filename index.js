const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

const keys = require('./config/keys')

require('./database/index.js')
require('./services/passport')

const PORT = process.env.PORT || 5000

const app = express()

app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days in mS
    keys: [keys.cookieKey]
}))
app.use(passport.initialize())
app.use(passport.session()) //must come after app.use(cookiesSession)/app.use(session)
app.use(bodyParser.json())

require('./routes/authRoutes')(app)
require('./routes/openmatRoutes')(app)
require('./routes/gymRoutes')(app)

//only runs in production mode. Needs to come after express routes are defined
if(process.env.NODE_ENV==='production'){
    //have express serve up production assets like main.js or main.css files
    //this has to go before the next line of code since the next line catches everything
    //code says that if it doesn't know where a file is then check here:
    app.use(express.static('client/build'))

    //have express serve up html file if it doesn't recognize the route, has to be the last route handler listed because it catches everything that made it this far
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT)