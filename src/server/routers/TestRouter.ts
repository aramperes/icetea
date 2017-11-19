import { Router } from "../webserver";

export default class TestRoute extends Router {
  constructor() {
    super('/test');
    this.get('/', (req, res) => {
      res.send('Hello from Ice Tea.');
    });
  }
}