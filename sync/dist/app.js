"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _http = require("http");

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

const controllerLoader = () => {}; // Middlewares


app.use((0, _morgan2.default)('dev'));
app.use((0, _express.json)());
app.use((0, _express.urlencoded)({
  extended: true
}));
app.use((0, _cookieParser2.default)());
app.use(_passport2.default.initialize()); // Set up Express

const router = _express2.default.Router();

controllerLoader(router);
app.use(router); // Server Events

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.info(`Listening on ${bind}`);
};

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
}; // Finally, create the web server


const server = (0, _http.createServer)(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
exports.default = app;