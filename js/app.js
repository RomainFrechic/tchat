(function ($){
	var socket = io.connect('http://localhost:1337');
	var msgtpl = $('#msgtpl').html();
	var lastmsg = false;
	$('#msgtpl').remove();

	$('#loginform').submit(function(event){
		event.preventDefault();
		socket.emit('login', {
			username : $('#username').val(),
			mail : $('#mail').val()
		})
	});

	 socket.on('logged', function(){
	 	$('#login').fadeOut();
	 });

	 //Envois de messages

	 $('#form').submit(function(event){
	 	socket.emit('newmsg', {message: $('#message').val()})
	 	event.preventDefault();
	 	$('#message').val('');
	 	$('#message').focus();
	 });

	 socket.on('newmsg', function(message){
	 	if(lastmsg != message.user.id){
	 		$('#messages').append('<div class="sep"></div>');
	 		lastmsg = message.user.id;
	 	}
	 	$('#messages').append('<div class="message"' + Mustache.render(msgtpl, message) + '</div>');
	 	//Animation scroll message 
	 	$('#messages').animate({scrollTop : $('#messages').prop('scrollHeight')}, 500);
	 });

	 //Gestion des connectées au tchat

	 socket.on('newuser', function(){
	 	$('#users').append('<img src="'+ user.avatar +'" id="'+ user.id +'">');
	 });

	 socket.on('disusr', function(user){
	 	$('#' + user.id).remove();
	 });

})(jQuery);