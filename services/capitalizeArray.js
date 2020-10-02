//function to capitalize the first letter of each word in an array, used before inserting into database

module.exports = arr => {
    return arr.map(el=>{
        //only apply if el is a string and not a website address
        if(typeof(el)==='string' && el.slice(0,4)!=='http'){
            //split the string into however many words it contains:
            let words = el.split(' ')
            //capitalize each word
            let capWords = words.map(word=>word[0].toUpperCase() + word.slice(1,el.length))
            //put capitalized words back together in a new string and return
            return capWords.join(' ')
        }
        else return el
    })
}