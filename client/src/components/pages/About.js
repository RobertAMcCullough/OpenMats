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
                    <p>OpenMats.org was built with a React front end and a C#/.NET/MSSQL backend by <a href='https://github.com/RobertAMcCullough'>Bob McCullough</a>.</p>
                    <p>Other technologies used include Redux, Google's Geocoding and Maps APIs, Bootstrap, JWT authentication (via cookies), Entity Framework and Dapper.</p>
                    <p>The front end is statically hosted from AWS and the backend and database are hosted on Microsoft Azure.</p>
                    <p>Contact Bob via <a href='mailto: robertamccullough@gmail.com'>email</a>.</p>
                </div>
            </div>
        )
    }
}

export default About