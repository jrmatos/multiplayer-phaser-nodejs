var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 4001;

app.use(express.static(path.join(__dirname, 'client')));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'client/index.html'));
});

server.listen(port, function () {
    console.log('App listening at', port);
});

function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}

/////////////////

var PLAYER_LIST = {};

function Player(socket) {
    this.socket = socket;
    this.id = socket.id;
    this.x = random(100, 700);
    this.y = 570;   
    this.spaceCraft = 'sc' + random(1, 2);

    this.getPlayerData = function () {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            spaceCraft: this.spaceCraft
        }
    }
}

io.on('connection', function (socket) {

    socket.on('askNewPlayer', function () {
        console.log('askNewPlayer....')

        // create new player and add it to the list
        var newPlayer = new Player(socket);
        PLAYER_LIST[newPlayer.id] = newPlayer;

        // send to all players
        broadcast(function (player) {
            player.socket.emit('addNewPlayer', newPlayer.getPlayerData());
        });
        
    });

    socket.on('keyDown', function (data) {

        if(!PLAYER_LIST[socket.id]) return;

        if(data.key === 'A' && PLAYER_LIST[socket.id].x > 0) {
            PLAYER_LIST[socket.id].x -= 5;
        }
        if(data.key === 'D' && PLAYER_LIST[socket.id].x < 800) {
            PLAYER_LIST[socket.id].x += 5;
        }
       

        broadcast(function (player) {
            player.socket.emit('updatePlayerPosition', PLAYER_LIST[socket.id].getPlayerData());
        });

    });

    socket.on('disconnect', function () {
        delete PLAYER_LIST[socket.id];
        broadcast(function (player) {
            player.socket.emit('removePlayer', socket.id);
        });
    });

    socket.on('getAllPlayers', function () {
        socket.emit('getAllPlayers', Object.keys(PLAYER_LIST).map(function (id) {
            return PLAYER_LIST[id].getPlayerData();
        }))
    });

    function broadcast(callback) {
        for(var socket_id in PLAYER_LIST) {
            if(PLAYER_LIST.hasOwnProperty(socket_id)) {
                callback(PLAYER_LIST[socket_id]);
            }
        }
    }

});