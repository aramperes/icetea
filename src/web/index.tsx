import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router} from "react-router";
import Routes from "./routes";
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory();

const router = () => (
    <Router history={history}>
        {Routes}
    </Router>
);

ReactDOM.render(
    router(),
    document.getElementById("app")
);
