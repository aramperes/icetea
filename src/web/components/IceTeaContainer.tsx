import * as React from "react";

// import "./IceTeaContainer.css"

export interface IceTeaContainerProps {
    child: any;
    url: string;
}

export default class IceTeaContainer extends React.Component<IceTeaContainerProps, {}> {
    render() {
        return (
            <div className={"IceTeaContainer-global"}>
                {this.createNavbar()}
                {this.props.child}
            </div>
        );
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
                    <input type="text" id="navbar-search" className={"IceTeaContainer-navbar-search"}
                           placeholder={"Search"}/>
                    <div className={"IceTeaContainer-navbar-searchresults-group"}>
                        <a href={"/issues/ABC-123"} className={"IceTeaContainer-navbar-searchresults-item"}>
                            [ABC-123] Please fix this bug
                        </a>
                        <a href={"/issues/ABC-123"} className={"IceTeaContainer-navbar-searchresults-item"}>
                            [ABC-456] The page loads slowly!
                        </a>
                        <a href={"/issues/ABC-123"} className={"IceTeaContainer-navbar-searchresults-item"}>
                            [ABC-789] ice tea is the best
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}
