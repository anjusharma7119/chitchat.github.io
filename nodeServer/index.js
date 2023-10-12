//node server which will handle socket io connection



const http = require('http');
const socketIo = require('socket.io');
const port = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
    // Handle other HTTP requests or routes if needed
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is running');
});

const io = socketIo(server, {
    cors: {
        origin: 'http://127.0.0.1:5500', // Replace with your client's origin
        methods: ['GET', 'POST'],
    },
});

// Define your Socket.io logic here
const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined',name=>{
        console.log("new user joined",name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    socket.on('send',message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect',message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
}) 

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});



// const io = require('socket.io')(8000)

// const users = {};

// io.on('connection', socket =>{
//     socket.on('new-user-joined',name=>{
//         console.log("new ")
//         users[socket.id] = name;
//         socket.broadcast.emit('user-joined', name)
//     });

//     socket.on('send',message =>{
//         socket.broadcast.emit('receive', {message: message, name: user[socket.id]})
//     });
// }) 
