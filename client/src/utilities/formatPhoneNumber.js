const phoneFormatter = ph => {
    const len = ph.length
    switch(len) {
        case(0):
            return null
        case(1,2,3):
            return (`(${ph})`)
        default:
            return ph
    }
}

export default phoneFormatter