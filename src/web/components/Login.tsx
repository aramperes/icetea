import * as React from "react";

// import "./BaseStyle.css"

export interface LoginGateMessage {
    type: "warning" | "error";
    title: string;
    content: string;
}

export interface LoginProps {
    gate_message?: LoginGateMessage;
}

export default class Login extends React.Component<LoginProps, {}> {
    render() {
        return (
            <div className={"BaseStyle-page-content"}>
                <h2>Login</h2>
                {this.renderGateMessage()}
                <p>Please enter your credentials to sign in:</p>
                <p>
                    <form method="post" action="/auth/login">
                        Username:
                        <br/>
                        <input type="text" name="username"/>
                        <br/><br/>
                        Password:
                        <br/>
                        <input type="password" name="password"/>
                        <br/><br/>
                        <input type="submit" value="Login"/>
                    </form>
                </p>
            </div>
        );
    }

    renderGateMessage(): JSX.Element {
        if (this.props.gate_message) {
            return (
                <div>
                    <strong>
                        {this.props.gate_message.title}: {this.props.gate_message.content}
                    </strong>
                </div>
            );
        } else {
            return undefined;
        }
    }
}
