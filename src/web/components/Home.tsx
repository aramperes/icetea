import * as React from "react";
import UserSchema from "../../db/schema/UserSchema";

// import "./BaseStyle.css"

export interface HomeProps {
    user?: UserSchema;
}

export default class Home extends React.Component<HomeProps, {}> {
    render() {
        return (
            <div className={"BaseStyle-page-content"}>
                <p>This is the home page</p>
                <p>
                    {this.getWelcomeMessage()}
                </p>
            </div>
        );
    }

    getWelcomeMessage(): JSX.Element {
        if (this.props.user) {
            return (
                <div>
                    Welcome, {this.props.user.name}.
                </div>
            );
        } else {
            return (
                <div>
                    You are not logged in. <a href={"/auth/login"}>Login here.</a>
                </div>
            );
        }
    }
}
