const mysql = require('mysql')

const requireAuth = require('../middlewares/requireAuth')
const connection = require('../database')

const applyFilters = require('../services/applyFilters')
const removeApostrophes = require('../services/removeApostrophes')

//RESTFUL '/api/** CRUD routes go here
//The New and Edit routes (both GET, which display forms) are handled by React Router on the client side
//The Index and Show routes (both GET) plus the POST/PUT/DELETE (Create, Update, Destroy) routes are handled by this API here on the back and are prefixed with '/api/'

module.exports = app => {

    //INDEX route - returns a list of gyms within a certain radius of lat/lng values
    //Searches for all gyms within search radius and then returns all openmats associated with them
    app.get('/api/openmats', (req,res)=>{
        const options = req.query.options ? JSON.parse(req.query.options) : null //if there is are advanced search options in the query string, set them to 'options' object

        const lat = parseFloat(req.query.lat)
        const lng = parseFloat(req.query.lng)
        const rad = options && options.distance ? options.distance/68.7 : 0.728 //radius is degrees lat/lng. 1 degree = 68.7 miles. default is 50 miles
        
        //the order of > and < operators will vary depending on if lat and/or lng is positive and negative. each of the 4 combinations will have a different order
        let queryStr = ''
        if(lat >= 0 && lng >= 0) queryStr = `SELECT * FROM gyms, openmats WHERE lat > ${lat-rad} AND lat < ${lat+rad} AND lng > ${lng-rad} AND lng < ${lng+rad} AND gyms.id = openmats.gym_id`
        if(lat >= 0 && lng < 0) queryStr = `SELECT * FROM gyms, openmats WHERE lat > ${lat-rad} AND lat < ${lat+rad} AND lng < ${lng+rad} AND lng > ${lng-rad} AND gyms.id = openmats.gym_id` //this is the case for the US
        if(lat < 0 && lng >= 0) queryStr = `SELECT * FROM gyms, openmats WHERE lat < ${lat+rad} AND lat > ${lat-rad} AND lng > ${lng-rad} AND lng < ${lng+rad} AND gyms.id = openmats.gym_id`
        if(lat < 0 && lng < 0) queryStr = `SELECT * FROM gyms, openmats WHERE lat < ${lat+rad} AND lat > ${lat-rad} AND lng < ${lng+rad} AND lng > ${lng-rad} AND gyms.id = openmats.gym_id`

        connection.query(queryStr, (err,rows)=>{
            if(err) throw err
            if(!options){
                res.send(rows) //if it's a regular search with no advanced search options just send back results
            }else{
                const filteredResults = applyFilters(rows, options)//else apply search options to results and send those back
                res.send(filteredResults)
            }

        })
    })

    //SHOW route - returns a single mat along with associated gym data
    app.get('/api/openmats/:id', (req,res)=>{
        connection.query(`SELECT * FROM openmats, gyms WHERE openmats.id=${req.params.id} AND openmats.gym_id=gyms.id`,(err,rows)=>{
            if(err) throw(err)
            res.send(rows[0])
        })
    })

    //CREATE route
    app.post('/api/openmats', requireAuth, (req,res)=>{
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
        // sqlFields = sqlFields.substr(0,sqlFields.length-1) //removes last ',' from string
        sqlFields = sqlFields + 'mat_created_by, last_updated_by'


        //creates query string of field values to insert
        let sqlValues = ''
        for(let i=0; i<fields.length; i++){
            if(fields[i]==='notes'){ //removes any apostrophes from notes field
                sqlValues = sqlValues + "'" + req.body[fields[i]].split("'").join("") + "',"
            }else{
                sqlValues = sqlValues + "'" + req.body[fields[i]] + "',"
            }
        }

        // sqlValues = sqlValues.substr(0,sqlValues.length-1) //removes last ',' from string
        sqlValues = sqlValues + `'${req.user.id}','${req.user.id}'`

        connection.query(`INSERT INTO openmats(${sqlFields}) VALUES(${sqlValues})`,(err,rows)=>{
            if(err) res.send({id: -1})
            else res.send({id: rows.insertId}) //id of newly created open mat
        })
    })

    //UPDATE route
    app.put('/api/openmats/:id', requireAuth, (req,res)=>{
        //create an array of field name from the req.body object. not all fields are required so this can vary
        let fields = []

        for(val in req.body){
            if(req.body[val]) fields.push(val)
        }

        //creates query string of field values to update
        let sqlSet = ''
        for(let i=0; i<fields.length; i++){
            if(fields[i]==='notes'){
                sqlSet = sqlSet +`${fields[i]}='${req.body[fields[i]].split("'").join("")}',`
            }else{
                sqlSet = sqlSet +`${fields[i]}='${req.body[fields[i]]}',`
            }
        }

        sqlSet = sqlSet.substr(0,sqlSet.length-1) //removes last ',' from string

        connection.query(`UPDATE openmats SET ${sqlSet} WHERE id=${req.body.id}`,(err,rows)=>{          
            if(err){res.send({id: -1});console.log(err)}
            else res.send({id: rows.insertId}) //id of newly created open mat
        })
    })

    //DESTROY route
    app.delete('/api/openmats/:id', requireAuth, (req,res)=>{
        //check to make sure person deleting mat is the one who created it
        connection.query(`SELECT * FROM openmats WHERE id=${req.params.id}`, (err,rows)=>{
            if(err) res.sendStatus(500) //if server error
            else if(rows[0].created_by!==req.body.id) res.sendStatus(401) //if user is not authorized to delete openmat
            else{
                connection.query(`DELETE FROM openmats WHERE id=${req.params.id}`, (err,rows)=>{
                    if(err) res.sendStatus(500) //if server error
                    else res.sendStatus(200)
                })
            }

        })
    })
}