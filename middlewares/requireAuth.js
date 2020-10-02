//this just makes sure a user is logged in - required for updating, deleting and creating mats and gyms

module.exports = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.status(401).send({error: 'Must be logged in'})
    }else{
        next()
    }
}