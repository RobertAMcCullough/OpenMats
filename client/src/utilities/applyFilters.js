//this applies filters contained in 'options' arg to results contained in 'rows' arg

export default (rows, options) => {
    //possible filters include day, time, gi/nogi, cost
    let results = rows //results will be filterd and returned at the end

    let days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

    let daysWanted = [] // will contain an array of days that results are wanted for

    days.forEach(el=>{
        if(options[el]) daysWanted.push(el)
    })

    //filter day
    //only runs if specific days are wanted
    if(daysWanted.length){
        results = results.filter(el=>{
            return daysWanted.includes(el.day)
        })
    }

    //filter time
    if(options.timeMorning || options.timeDay || options.timeEvening){
        results = results.filter(el=>{
            const time = parseInt(el.time.slice(0,2)) + parseInt(el.time.slice(3,5))/60 // creates a number value for time
            //timeMorning is 11 or before
            if(time <= 11){
                return options.timeMorning // return true if timeMorning has been selected
            }
            //timeDay is 11 to 4
            if(time >= 11 && time <= 16){
                return options.timeDay // return true if timeMorning has been selected
            }
            //timeEvening is after 4
            if(time >=16){
                return options.timeEvening // return true if timeMorning has been selected
            }
        })
    }

    //filter gi/nogi
    if(options.gi || options.nogi){
        results = results.filter(el=>{
            if(options.gi && options.nogi) return true
            if(!el.gi_nogi) return false
            if(el.gi_nogi===1) return options.gi
            if(el.gi_nogi===2) return options.nogi
            if(el.gi_nogi===3 || el.gi_nogi===4) return true // this for mixed and alternating gi/nogi - always return these
        })
    }

    //filter cost
    if(options.free){
        results = results.filter(el=>{
            return el.cost===0
        })
    }

    return results
}