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
            </div>
        )
    }
}
