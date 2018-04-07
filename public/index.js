socket = io()
//console.log(socket.id);

window.onload = function () {
    var msg = document.getElementById('message');
    var send = document.getElementById('send');
    var list = $('#list');
    var reg = document.getElementById('register');
    var join = document.getElementById('join');

    send.onclick = function () {
        var message = msg.value;
        var toUser = "";

        if(message.charAt(0) == '@'){
            var arr = message.split(' ');
            message = arr[1];
            toUser = arr[0];
            var arr2 = toUser.split('@');
            toUser = arr2[1];
        }
        console.log(toUser);
        
        socket.emit('sendMsg', {message : message, toUser : toUser});
    }

    socket.on('recMsg', (data) => {
        list.append('<li>' + data.message + '</li>')
    })

    reg.onclick = function () {
        $('#box').css('display', 'block');
        console.log("register in process");
        var username = $('#username').val();
        socket.emit('register', { username: username });        
    }
    
    join.onclick = function () {
        console.log('connecting to chatroom');
        var roomname = $('#roomname').val();
        socket.emit('roomconnect', {roomname : roomname})
    }
}
