const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

var isReg = false;

ids = []
usernames = []
var rooms = new Map();


io.on('connection', (socket) => {

    //console.log(socket.id);

    socket.on('register', (user) => {
        ids.push(socket.id);
        usernames.push(user.username);
        isReg = true;
    });

    socket.on('roomconnect', (room) => {
        if(rooms.get(room.roomname) == undefined){
            var arr = new Array();
            arr.push(socket.id);
            rooms.set(room.roomname, arr);
        }else{
            var arr = rooms.get(room.roomname);
            arr.push(socket.id);
            rooms.set(room.roomname, arr);
        }
    });

    socket.on('sendMsg', (data) => {
        
        if(isReg == true){
            console.log("message is : " + data.message);
            // io.emit('recMsg', { message: data.message }) //socket is just for current user...
            console.log(data.toUser);
            
            if(data.toUser == ''){
                io.emit('recMsg', { message: data.message })
            }else{
                console.log(data.toUser);
                io.to(ids[usernames.indexOf(data.toUser)]).emit('recMsg', { message: data.message })
            }
        }
    });
});

app.use('/', express.static(__dirname + '/public'));

server.listen(4400, () => {
    console.log('http://localhost:4400');
})