import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import AdminIndex from './AdminIndex'

const Main = ()=>{
    return (
        <Router>
            <Route path="/" exact component={Login} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/index" component={AdminIndex} />
        </Router>
    )
}

export default Main