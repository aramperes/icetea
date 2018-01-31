import * as React from "react";

// import "./IceTeaContainer.css"

export interface IceTeaContainerProps {
    child: any;
}

export default class IceTeaContainer extends React.Component<IceTeaContainerProps, {}> {
    render() {
        return (
            <div className={"IceTeaContainer-global"}>
                <div className={"IceTeaContainer-navbar"}>
                    <a href="/">
                        <div className={"IceTeaContainer-navbar-icon"}></div>
                    </a>
                    <a href="/" /* activeClassName={"IceTeaContainer-navbar-item-active"} exact={true} */ >
                        <div className={"IceTeaContainer-navbar-item"}>
                            Home
                        </div>
                    </a>
                    <a href="/projects" /* activeClassName={"IceTeaContainer-navbar-item-active"} */ >
                        <div className={"IceTeaContainer-navbar-item"}>
                            Projects
                        </div>
                    </a>
                    <a href="/issues" /* activeClassName={"IceTeaContainer-navbar-item-active"} */ >
                        <div className={"IceTeaContainer-navbar-item"}>
                            Issues
                        </div>
                    </a>
                </div>
                {this.props.child}
            </div>
        );
    }
}
