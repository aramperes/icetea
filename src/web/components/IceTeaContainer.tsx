import * as React from "react";
import "./IceTeaContainer.css"
import {Link} from "react-router-dom";

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
                    <Link to={"/"}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Home
                        </div>
                    </Link>
                    <Link to={"/projects"}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Projects
                        </div>
                    </Link>
                    <Link to={"/issues"}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Issues
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}
