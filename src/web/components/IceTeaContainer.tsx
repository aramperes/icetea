import * as React from "react";
import "./IceTeaContainer.css"
import {Link, NavLink} from "react-router-dom";

export interface IceTeaContainerProps {
}

export default class IceTeaContainer extends React.Component<IceTeaContainerProps, {}> {
    render() {
        return (
            <div className={"IceTeaContainer-global"}>
                <div className={"IceTeaContainer-navbar"}>
                    <Link to={"/"}>
                        <div className={"IceTeaContainer-navbar-icon"}> </div>
                    </Link>
                    <NavLink to={"/"} activeClassName={"IceTeaContainer-navbar-item-active"} exact={true}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Home
                        </div>
                    </NavLink>
                    <NavLink to={"/projects"} activeClassName={"IceTeaContainer-navbar-item-active"}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Projects
                        </div>
                    </NavLink>
                    <NavLink to={"/issues"} activeClassName={"IceTeaContainer-navbar-item-active"}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Issues
                        </div>
                    </NavLink>
                </div>
            </div>
        );
    }
}
