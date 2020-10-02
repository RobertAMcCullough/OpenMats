import React from 'react'

class About extends React.Component{
    componentDidMount(){
        document.title = 'OpenMats.org | About'
    }

    render(){
        return(
            <div>
                <hr></hr>
                <div>
                    <p>OpenMats.org was built on a SERN stack (MySQL, Express.js, React, Node.js) by <a href='https://github.com/RobertAMcCullough'>Bob McCullough</a>.</p>
                    <p>Other technologies used include Redux, Google's Geocoding and Maps Javascript APIs, Bootstrap, and Passport.js (Google, Facebook, and Local authentication strategies).</p>
                    <p>Contact Bob via <a href='mailto: robertamccullough@gmail.com'>email</a>.</p>
                </div>
            </div>
        )
    }
}

export default About