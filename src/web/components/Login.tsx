import * as React from "react";
// import "./BaseStyle.css"

export interface LoginProps {
}

export default class Login extends React.Component<LoginProps, {}> {
    render() {
        return (
            <div className={"BaseStyle-page-content"}>
                <p>This is the login page</p>
            </div>
        );
    }
}
