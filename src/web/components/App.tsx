import * as React from "react";

class AppContainerProps {
    content;
    title: string;
}

export default class App extends React.Component<AppContainerProps, {}> {
    render() {
        return (
            <html>
            <head>
                <title>{this.props.title}&nbsp;&middot;&nbsp;icetea</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="stylesheet" href="/public/style.css"/>
            </head>
            <body>
            <div id="app">{this.props.content}</div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.1.1/cjs/react.production.min.js"/>
            <script src="/public/bundle.js"/>
            </body>
            </html>
        )
    }
}
