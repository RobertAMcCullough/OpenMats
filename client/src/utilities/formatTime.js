const formatTime = time => {
    time = time.slice(0,5) //remove seconds
    
    let hour = parseInt(time.slice(0,2))    //get hour

    const AMPM = hour < 12 ? ' AM' : ' PM' //get AM or PM (noon is 12 PM)

    hour = hour > 12 ? hour - 12 : hour //format hour

    time = hour.toString() + time.slice(2,5) + AMPM //add hour and add AM or PM

    return time
}

export default formatTime