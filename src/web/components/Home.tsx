import * as React from "react";
import "./BaseStyle.css"

export interface HomeProps {
}

export default class Home extends React.Component<HomeProps, {}> {
    render() {
        return (
            <div className={"BaseStyle-page-content"}>
                <p>This is the home page</p>
            </div>
        );
    }
}
