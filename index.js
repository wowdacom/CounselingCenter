let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let counselor = [{name: 'Peter', status: 0}, {name: 'Helen', status: 0}, {name: 'John', status: 0}, {name: 'Mary', status: 0}]


app.get('/', (req, res) => {
  // res.send('<h1>Hello World</h1>');
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', (socket) => {
  let user_name = ""
  let user_id = ""
  let last_message = ""

  socket.on('login', (name, id) => {
    user_name = name
    user_id = id
    io.emit('chat message', `Hello! ${user_name} ${socket.id}`);
    if (counselor.map(item=>item.name).includes(id)) {
      let current_id = counselor.map(item=>item.name).indexOf(id)
      counselor[current_id].status = 1
    }
    io.emit('counselor status', counselor.map(item=>item.status));
  });

  socket.on('say to someone', (id, msg) => {
    console.log(id, msg)
    socket.to(id).emit('chat message', msg, id);
    // send a private message to the socket with the given id
    // socket.to(id).emit('my message', msg, id);
  });

  socket.on('hint', () => {
    io.emit('hint', `${user_name} is typing...`);
  });

  socket.on('chat message', (msg) => {
    if (last_message === msg) {
      return
    } else {
      last_message = msg
    }
    io.emit('chat message',`${user_name}: ${last_message}`);
  })
  socket.on('disconnect', () => {
    io.emit('chat message', `${user_name}已離開`);
  });
});

http.listen(3000, ()=>{
  console.log('listening on *:3000')
})
