//formats timestamp into readable date
export default d => {

    let date = new Date(d).toString()

    date = date.slice(4,15)

    //adds comma between day and year
    date = date.slice(0,6) + ', ' + date.slice(6,15)

    //removes 0 if present in day
    if(date[4] === '0') date = date.slice(0,4) + date.slice(5,17)

    return date
}