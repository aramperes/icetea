import { Router } from "../webserver";
import * as path from "path";

export default class TestRoute extends Router {
  constructor() {
    super('/');
    this.get('/', (req, res) => {
      res.sendFile(path.join(this._root_path, "index.html"));
    });
  }
}