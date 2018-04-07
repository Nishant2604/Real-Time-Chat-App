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
var ref = new Map();


io.on('connection', (socket) => {

    socket.on('register', (user) => {
        ids.push(socket.id);
        usernames.push(user.username);
        isReg = true;
    });

    socket.on('roomconnect', (room) => {
        ref.set(socket.id, room.roomname);

        if(rooms.get(room.roomname) == undefined){
            var arr = new Array();
        }else{
            var arr = rooms.get(room.roomname);
        }

        arr.push(socket.id);
        rooms.set(room.roomname, arr);
    });

    socket.on('sendMsg', (data) => {
        
        if(isReg == true){
            console.log("message is : " + data.message);
            
            if(data.toUser == ''){
                
                var members = rooms.get(ref.get(socket.id));
                members.forEach(element => {
                    io.to(element).emit('recMsg', { message: data.message })
                });
                
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