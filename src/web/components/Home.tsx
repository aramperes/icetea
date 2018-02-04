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
                <h2>Home</h2>
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
                    <p>
                        Welcome, {this.props.user.name}.
                    </p>
                    <p>
                        This is your dashboard.
                    </p>
                    <p>
                        You can logout <a href={"/auth/logout"}>here</a>.
                    </p>
                </div>
            );
        }
        // not logged-in
        return (
            <div>
                You are not logged in. <a href={"/auth/login"}>Login here.</a>
            </div>
        );
    }
}
