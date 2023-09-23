const express = require('express');
const socket = require('socket.io');

const app = express();

const task = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', task);

  console.log('New client! Its id – ' + socket.id);

  socket.on('addTask', (incommingTask) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    task.push(incommingTask);
    socket.broadcast.emit('addTask', incommingTask);
  });

  socket.on('removeTask', (idTask) => {
    
    for(let singleTask of task) {
      if(singleTask.id === idTask) {
        task.splice(task.indexOf(singleTask), 1);
        socket.broadcast.emit('updateData', task);
      };
    };
  });
});

