var http =require('http');
var md5 = require('MD5');

httpServer =http.createServer(function(req,res){
    console.log('Un utilisateur a affiche la page')
});

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = {};
var messages = [];
var quantifmsg = 30;

io.sockets.on('connection', function(socket){
	var me = false;
	console.log('nouveau utilisateur');

	for (var k in users) {
		socket.emit('newusr', users[k]);
	}

	for (var k in messages) {
		socket.emit('newmsg', messages[k]);
	}

	//Les messages reçus

	socket.on('newmsg', function(message){
		message.user = me;
		date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
		message.push(message);
		if(messages.length > quantifmsg){
			messages.shift();
		}
		io.socket.emit('newmsg', message);
	});

	//Les connectés au tchat

	socket.on('login', function(user){
		console.log(user);
		me = user;
		me.id = user.mail.replace('@','-').replace('.','-');
		me.avatar = 'htpps://gravatar.com/avatar/' + md5(user.mail) + '?s=50';
		socket.emit('logged');
		users[me.id] = me;
		io.socket.emit('newuser', me);
	});

	//les déconectés au tchat

	socket.on('disconnect', function(){
		if(!me){
			return false;
		}
		delete users[me.id];
		io.sockets.emit('disusr', me);
	})
});