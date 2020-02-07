"use strict";

var _app = require("./app");

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = process.env.SYNC_PORT; //START THE SERVER

_app2.default.listen(port, () => {
  console.info('api running on port ' + port);
});