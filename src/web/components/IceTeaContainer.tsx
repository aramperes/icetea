import * as React from "react";
import "./IceTeaContainer.css"

export interface IceTeaContainerProps {
}

export default class IceTeaContainer extends React.Component<IceTeaContainerProps, {}> {
    render() {
        return (
            <div className={"IceTeaContainer-global"}>
                <div className={"IceTeaContainer-navbar"}>
                    <a href={"/"}>
                        <div className={"IceTeaContainer-navbar-icon"}> </div>
                    </a>
                    <a href={"/"}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Home
                        </div>
                    </a>
                    <a href={"/projects"}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Projects
                        </div>
                    </a>
                    <a href={"/issues"}>
                        <div className={"IceTeaContainer-navbar-item"}>
                            Issues
                        </div>
                    </a>
                </div>
            </div>
        );
    }
}
