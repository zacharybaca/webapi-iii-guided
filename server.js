const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next(); //allows request to continue to next middleware
}

//gatekeeper middleware
function gateKeeper(req, res, next) {
  if (req.headers.password === 'mellon') {
    next();
  } else {
    res.status(401).json({
      message: 'Incorrect Password'
    });
  }
}
//server.use(helmet());
server.use(express.json());
server.use(logger);
server.use('/area51', gateKeeper);
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get('/echo', (req, res) => {
  res.send(req.headers);
});

server.get('/area51', helmet(), (req, res) => {
  res.send(req.headers);
});

module.exports = server;
