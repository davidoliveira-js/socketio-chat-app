const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});
const helmet = require('helmet');
const cors = require('cors');

require('./src/database/connection');
const App = require('./src/App');
require('dotenv').config();

const port = process.env.PORT == undefined ? 7880 : process.env.PORT;

io.on('connection', (socket) => {
  socket.on('send', (data) => {
    io.emit('receive', data);
  });
  socket.on('disconnect', () => {});
});

app.use(
  cors({
    origin: 'https://socketio-chat-app.vercel.app',
    credentials: true,
  })
);
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/', App);

http.listen(process.env.PORT || 7880, () => {
  console.log('Server running on port ' + port);
});

exports.io = io;
