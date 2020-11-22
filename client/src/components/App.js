import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch} from 'react-router-dom'

import { fetchUser, screenResize } from '../actions'

import Header from './Header'
// import Footer from './Footer'
import Home from './pages/Home'
import About from './pages/About'
import AllGyms from './pages/AllGyms'
import SearchResults from './pages/SearchResults'
import AdvancedSearch from './pages/AdvancedSearch'
import MatDetail from './pages/MatDetail'
import GymDetail from './pages/GymDetail'
import Create from './pages/Create'
import CreateMat from './pages/CreateMat'
import UpdateMat from './pages/UpdateMat'
import UpdateGym from './pages/UpdateGym'
import FailedLogin from './pages/FailedLogin'

import './styles/styles.css'


class App extends React.Component {

    componentDidMount(){
        //updates state when window is resized
        window.addEventListener('resize', ()=>{
            this.props.screenResize(window.innerWidth)
        })

        this.props.fetchUser()
        this.props.screenResize(window.innerWidth)
    }


    render(){
        return(
            <div>            
                <div className='container'>
                    <BrowserRouter>
                        <Route path='/' component={Header}></Route>
                        <Route path='/' exact component={Home}></Route>
                        <Route path='/about' exact component={About}></Route>
                        <Route path='/allgyms' exact component={AllGyms}></Route>
                        <Route path='/failedLogin' exact component={FailedLogin}></Route>
                        <Route path='/advancedSearch' exact component={AdvancedSearch}></Route>
                        <Switch>
                            <Route path='/gyms/:id' exact component={GymDetail}></Route>
                            <Route path='/gyms/:id/edit' exact component={UpdateGym}></Route>
                        </Switch>
                        <Switch>
                            <Route path='/openmats' exact component={SearchResults}></Route>
                            <Route path='/openmats/new' exact component={Create}></Route>
                            <Route path='/openmats/:id' exact component={MatDetail}></Route>
                            <Route path='/openmats/:id/edit' exact component={UpdateMat}></Route>
                            <Route path='/openmats/:id/new' exact component={CreateMat}></Route>
                        </Switch>
                        {/* <Route path='/' component={Footer}></Route> */}
                    </BrowserRouter>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return({
        user: state.user
    })
}

export default connect(mapStateToProps, {fetchUser, screenResize})(App)
