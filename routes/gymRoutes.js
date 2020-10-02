const mysql = require('mysql')

const requireAuth = require('../middlewares/requireAuth')
const connection = require('../database')
const capitalizeArray = require('../services/capitalizeArray')
const removeApostrophes = require('../services/removeApostrophes')

//RESTFUL '/api/** CRUD routes go here
//
//The New and Edit routes (both GET, which display forms) are handled by React Router on the client side
//The Index and Show routes (both GET) plus the POST/PUT (Create, Update) routes are handled by this API here on the back and are prefixed with '/api/'. There is not a Destroy route for gyms

module.exports = app => {

    //INDEX route - returns a list of all gyms
    app.get('/api/gyms', (req,res)=>{
        
        connection.query('SELECT * FROM gyms ORDER BY city, state', (err,rows)=>{
            if(err) throw err
            res.send(rows)
        })
    })

    //SHOW route - returns the info on one gym, along with all the open mats associated with that gym
    app.get('/api/gyms/:id', (req,res)=>{
        connection.query(`SELECT * FROM gyms LEFT JOIN openmats ON openmats.gym_id = gyms.id WHERE gyms.id=${req.params.id}`,(err,rows)=>{
            if(err) throw(err)
            res.send(rows)
        })
    })

    // //CREATE route
    app.post('/api/gyms', requireAuth, (req,res)=>{
        //create an array of field name from the req.body object. not all fields are required so this can vary
        let fields = []

        for(val in req.body){
            if(req.body[val]) fields.push(val)
        }

        //creates query string of field names
        let sqlFields = ''
        for(let i=0; i<fields.length; i++){
            sqlFields = sqlFields + fields[i] + ','
        }
        sqlFields = sqlFields + 'gym_created_by'

        //creates an array of values for each field
        let fieldValues = []
        for(let i=0; i<fields.length; i++){
            fieldValues.push(req.body[fields[i]])
        }

        //now capitalize all the values
        fieldValues = capitalizeArray(fieldValues)

        //remove apostrophes so they don't cause an error
        fieldValues = removeApostrophes(fieldValues)

        //creates query string of field values to insert
        let sqlValues = ''
        for(let i=0; i<fieldValues.length; i++){
            sqlValues = sqlValues + "'" + fieldValues[i] + "',"
        }
        sqlValues = sqlValues + `'${req.user.id}'`

        connection.query(`INSERT INTO gyms(${sqlFields}) VALUES(${sqlValues})`,(err,rows)=>{
            if(err) res.send({id: -1})
            else res.send({id: rows.insertId}) //id of newly created open mat
        })
    })

    // //UPDATE route
    app.put('/api/gyms/:id', requireAuth, (req,res)=>{
        //create an array of field name from the req.body object. not all fields are required so this can vary
        let fields = []

        for(val in req.body){
            if(req.body[val]) fields.push(val)
        }

        //removes apostrophe from a string
        const removeApost = str => {
            if(typeof(str)==='string'){
                return str.split("'").join("")
            }else{
                return(str)
            }
        }

        //creates query string of field values to update
        let sqlSet = ''
        for(let i=0; i<fields.length; i++){
            sqlSet = sqlSet +` ${fields[i]}='${removeApost(req.body[fields[i]])}',`
        }

        sqlSet = sqlSet.substr(0,sqlSet.length-1) //removes last ',' from string

        connection.query(`UPDATE gyms SET ${sqlSet} WHERE id=${req.body.id}`,(err,rows)=>{
            if(err){res.send({id: -1});console.log(err)}
            else res.send(rows[0])
        })
    })
    
    //DESTROY route
    app.delete('/api/gyms/:id', requireAuth, (req,res)=>{
        //check to make sure person deleting mat is the one who created it
        connection.query(`SELECT * FROM gyms WHERE id=${req.params.id}`, (err,rows)=>{
            if(err) res.sendStatus(500) //if server error
            else if(rows[0].created_by!==req.body.id) res.sendStatus(401) //if user is not authorized to delete openmat
            else{
                connection.query(`DELETE FROM gyms WHERE id=${req.params.id}`, (err,rows)=>{
                    if(err) res.sendStatus(500) //if server error
                    else res.sendStatus(200)
                })
            }

        })
    })
} 