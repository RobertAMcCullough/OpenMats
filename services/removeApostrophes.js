//This removes the apostrophes from an array of strings

module.exports = arr => {
    return arr.map(str => {
        if(typeof(str)==='string'){
        return str.split("'").join("")
        }else{
            return str
        }
    })
}

//This is another option:
//This accepts an array of strings and changes any apostrophe in a string (') to a double apostrophe ('') which is suitable for insertion in a mysql statement. Otherwise an error will be thrown.

// module.exports = arr => {
//     return arr.map(str=>{
//         const splits = str.split("'") //splits at apostrophes
//         return splits.join("''") //joined back together again with two apostrophes
//     })
// }