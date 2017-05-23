(function () {
    'use strict'; 

    var Game = function () {
        this.PLAYER_LIST = [];
    };

    Game.init = function () {
        this.game.stage.disableVisibilityChange = true;
    };

    Game.prototype.preload = function () {
        this.game.load.image('sc1', 'assets/img/sc1.png');
        this.game.load.image('sc2', 'assets/img/sc2.png');
        this.game.load.image('planet', 'assets/img/planet.png');
        this.game.load.image('planet', 'assets/img/planet.png');
    }   
    
    Game.prototype.create = function () {

        var self = this;

        // state configs
        this.game.physics.startSystem(Phaser.Physics.ARCADE);    

        var bg = this.game.add.sprite(0, 0, 'planet');

        this.keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.keyD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.keyS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);

        // get all players
        socket.emit('getAllPlayers');

        socket.on('getAllPlayers', function (data) {
            self.getAllPlayers(data);
        })

       

        // handle add new player
        socket.on('addNewPlayer', function (data) {
            self.addNewPlayer(data);            
        });

        socket.on('updatePlayerPosition', function (data) {
            self.updatePlayerPosition(data);
        });

        socket.on('removePlayer', function (id) {
            self.PLAYER_LIST[id].kill();
            setTimeout(function () {
                delete self.PLAYER_LIST[id];
            }, 10);
        });
    }

    Game.prototype.update = function () {
        this.handleInputs();
    }

    Game.prototype.getAllPlayers = function(players) {
        var self = this;
        players.forEach(function (player) {
            self.addNewPlayer(player);
        });

        // ask new player
        socket.emit('askNewPlayer');
    };

    Game.prototype.updatePlayerPosition = function(player) {
        this.PLAYER_LIST[player.id].position.x = player.x;
        this.PLAYER_LIST[player.id].position.y = player.y;
    };

    Game.prototype.addNewPlayer = function(data) {
        this.PLAYER_LIST[data.id] = this.game.add.sprite(data.x, data.y, data.spaceCraft);
        this.PLAYER_LIST[data.id].anchor.set(0.5);
        this.PLAYER_LIST[data.id].width = 40;
        this.PLAYER_LIST[data.id].height = 40;
        this.game.physics.arcade.enable(this.PLAYER_LIST[data.id]);
    };
    
    Game.prototype.handleInputs = function () {

        if(this.keyA.isDown) {
            socket.emit('keyDown', { key: 'A' });
        }
        if(this.keyD.isDown) {
            socket.emit('keyDown', { key: 'D' });
        }
        if(this.keyS.isDown) {
            socket.emit('keyDown', { key: 'S' });
        }
        if(this.keyW.isDown) {
            socket.emit('keyDown', { key: 'W' });
        }
        
    }
    
    gameManager.addState('game', Game);

})();