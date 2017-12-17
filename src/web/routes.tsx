import * as React from "react";
import {Route} from "react-router";
import IceTeaContainer from "./components/IceTeaContainer";
import Home from "./components/Home"
import Login from "./components/Login"

const Routes = (
    <div>
        <Route path='/' component={IceTeaContainer}/>
        <Route exact path='/' component={Home}/>
        <Route exact path='/login' component={Login}/>
    </div>
);

export default Routes;
