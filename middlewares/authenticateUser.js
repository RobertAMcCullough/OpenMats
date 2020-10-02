//this makes sure the user that is trying to delete a mat or gym is either the one who created it, or the admin
//this prevents someone from using a program like postman to delete items
//currently this is not being used

module.exports = (req, res, next) => {
    const userId = req.user.userId
    const createdBy = req.body.created_by

    //user must either be adming (id = 1) or the person who created it
    if(userId === 1 || userId === createdBy){
        next()
    }else{
        res.status(401).send({error: 'User is not authorized to delete'})
    }
}