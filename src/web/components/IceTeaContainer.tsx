import * as React from "react";
import UserSchema from "../../db/schema/UserSchema";

// import "./IceTeaContainer.css"

export interface IceTeaContainerProps {
    child: any;
    user: UserSchema;
    url: string;
}

export default class IceTeaContainer extends React.Component<IceTeaContainerProps, {}> {
    render() {
        return (
            <div className={"IceTeaContainer-global"} id={"IceTeaContainer"}>
                {this.createNavbar()}
                <div className={"IceTeaContainer-global-content"}>
                    {this.props.child}
                </div>
                <div className={"IceTeaContainer-global-footer"}>
                    <p>
                        {this.getFooterMessage()}

                    </p>
                    <p>
                        <a href={"https://www.icetea.io"}>ice tea</a> is open-source software, licensed under the MIT.
                        <br />
                        &copy; 2018 ice tea.
                    </p>
                </div>
            </div>
        );
    }

    getFooterMessage(): JSX.Element {
        if (this.props.user) {
            return (
                <div>
                    You are logged in as demo &mdash; <a href={"/auth/logout"}>Logout</a>
                </div>
            );
        }
        return (
            <div>
                You are not signed in &mdash; <a href={"/auth/login"}>Login</a>
            </div>
        )
    }

    createNavbar() {
        let mainNavbarElements = [
            {
                url: "/",
                title: "Home"
            },
            {
                url: "/projects",
                title: "Projects"
            },
            {
                url: "/issues",
                title: "Issues"
            }
        ];
        let domNav = [];
        for (let navElement of mainNavbarElements) {
            navElement['selected'] = this.props.url === navElement.url;
            domNav.push((
                <a key={"nav-" + navElement.title} href={navElement.url}
                   className={navElement['selected'] === true ? "IceTeaContainer-navbar-item-active" : ""}>
                    <div className={"IceTeaContainer-navbar-item"}>
                        {navElement.title}
                    </div>
                </a>
            ));
        }
        return (
            <div className={"IceTeaContainer-navbar"}>
                <a href="/">
                    <div className={"IceTeaContainer-navbar-icon"}/>
                </a>
                {domNav}
                <div className={"IceTeaContainer-navbar-search-group"}>
                    <input type="text" id="IceTeaContainer-navbar-search" className={"IceTeaContainer-navbar-search"}
                           placeholder={"Search"}/>
                    <div className={"IceTeaContainer-navbar-searchresults-group hidden"}
                         id={"IceTeaContainer-navbar-searchresults"}>
                        <a href={"/issues/ABC-123"} className={"IceTeaContainer-navbar-searchresults-item"}>
                            <span className={"IceTeaContainer-navbar-searchresults-item-title"}>
                                [ABC-123] Please fix this bug
                            </span>
                            <span className={"label-status status-investigating"}>Investigating</span>
                        </a>
                        <a href={"/issues/ABC-456"} className={"IceTeaContainer-navbar-searchresults-item"}>
                            <span className={"IceTeaContainer-navbar-searchresults-item-title"}>
                                [ABC-456] The page loads slowly!
                            </span>
                            <span className={"label-status status-open"}>Open</span>
                        </a>
                        <a href={"/issues/ABC-789"} className={"IceTeaContainer-navbar-searchresults-item"}>
                            <span className={"IceTeaContainer-navbar-searchresults-item-title"}>
                                [ABC-789] ice tea is the best
                            </span>
                            <span className={"label-status status-inprogress"}>In Progress</span>
                        </a>
                        <a href={"/issues/ABC-999"} className={"IceTeaContainer-navbar-searchresults-item"}>
                            <span className={"IceTeaContainer-navbar-searchresults-item-title"}>
                                [ABC-999] New feature: make everything in React.JS
                            </span>
                            <span className={"label-status status-inprogress"}>In Progress</span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}
