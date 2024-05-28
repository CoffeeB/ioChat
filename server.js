var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

users = [];
connections = [];

server.listen(1000, '0.0.0.0');
console.log("server running");

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('connected:  %s sockets connected', connections.length);

    // disconnect
    socket.on('disconnect', (data) => {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // send messages
    socket.on('send message', (data) => {
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    // new user
    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    }); 

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});

