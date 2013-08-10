/*
 * GET home page.
 */
 
var allSockets;

exports.getAllSockets = function(inSocket) {
  allSockets = inSocket;
};
 
exports.index = function(req, res){
  
  
  //send event to all connected
  for (var sock in allSockets) {
     allSockets[sock].emit('secondEvent', {msg: 'Whoa...'});
  }
  
  console.log("All the sockets in memory:");
  console.log(allSockets);

  res.render('index', { title: 'Express' });  
};
