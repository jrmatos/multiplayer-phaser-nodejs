var socket = (function (socket) {
    'use strict';

    socket.on('connect', function(){
        console.log('connect...');
    });

    socket.on('event', function(data){});
    socket.on('disconnect', function(){});


    return socket;

})(io('http://localhost:4001'));