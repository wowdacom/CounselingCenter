let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);


app.get('/', (req, res) => {
  // res.send('<h1>Hello World</h1>');
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', (socket) => {
  let user_name = ""
  let last_message = ""

  socket.on('hello', (name) => {
    user_name = name
    io.emit('chat message', `Hello! ${user_name}`);
  });

  socket.on('hint', () => {
    console.log(`${user_name} is typing...`)
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
    console.log('user disconnected');
    io.emit('chat message', `${user_name}已離開`);
  });
});

http.listen(3000, ()=>{
  console.log('listening on *:3000')
})
