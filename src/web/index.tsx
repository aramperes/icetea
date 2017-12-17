import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import Routes from "./routes";

const router = () => (
    <BrowserRouter>
        {Routes}
    </BrowserRouter>
);

ReactDOM.render(
    router(),
    document.getElementById("app")
);
