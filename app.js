const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
require('./config/db.js');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const { TextDecoder } = require('util');
const socketIo = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server); // Attach Socket.IO to the server
const UserOneVsOneList = require('./models/userOneVsOneList.js');
const User = require('./models/User');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  let intervalId = null; // Interval reference

  // Handle user registration for a room
  socket.on('registerUser', (userId) => {
    if (userId) {
      socket.join(userId); // Join the room with userId
      console.log(`User with ID ${userId} joined room ${userId}`);
    }
  });

  // Handle fetching the user list
  socket.on('getUserList', (data) => {
    const { userId, category } = data;
    console.log("data-----", data);

    if (!userId || !category) {
      socket.emit('error', { message: 'User ID and category are required' });
      return;
    }

    const fetchAndEmitUserList = async () => {
      try {
        // Fetch list of users in the specified category excluding the requesting user
        const userOneVsOneList = await UserOneVsOneList.find({
          category,
          userId: { $ne: userId },
        });

        // Get user details from the User collection
        const userIds = userOneVsOneList.map((entry) => entry.userId);
        const users = await User.find({
          _id: { $in: userIds },
          status: 'approved',
          connectStatus: 'online',
        }).select('-otp');

        // Filter and format the response
        const filteredUsers = userOneVsOneList.filter((entry) =>
          users.some((user) => user._id.toString() === entry.userId.toString())
        );

        const response = filteredUsers.map((entry) => {
          const user = users.find((user) => user._id.toString() === entry.userId.toString());
          return {
            _id: entry._id,
            userId: {
              _id: user._id,
              username: user.username,
              image: user.profile.image,
              DOB: user.profile.dateOfBirth,
              status: user.status,
              connectStatus: user.connectStatus,
              mobileNumber: user.mobileNumber,
              description: user.profile.userDescription,
            },
            category: entry.category,
            channelName: entry.channelName,
            token: entry.token,
          };
        });

        console.log("response--------", response);
        // Emit the data to the specific userId
        io.to(userId).emit('userList', {
          users: response,
          appId: 'ce47f829d5514255972835067b6f228f',
        });
      } catch (err) {
        console.error('Error fetching user list:', err);
        socket.emit('error', { message: 'Error fetching user list' });
      }
    };

    // Initial fetch
    fetchAndEmitUserList();

    // Set interval to emit user list every 3 seconds
    intervalId = setInterval(fetchAndEmitUserList, 3000);

    // Handle category change
    socket.on('changeCategory', (newCategory) => {
      if (newCategory !== category) {
        // Immediately clear the old list
        io.to(userId).emit('userList', { users: [] });

        clearInterval(intervalId); // Clear the previous interval

        // Update the category and fetch the new list
        category = newCategory;

        // Fetch the new category's users
        fetchAndEmitUserList();

        // Set new interval for the new category
        intervalId = setInterval(fetchAndEmitUserList, 3000);
      }
    });
  });

  // Clean up on socket disconnect
  socket.on('disconnect', () => {
    clearInterval(intervalId); // Clear the interval
    console.log(`A user disconnected: ${socket.id}`);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
const corsOptions = {
  origin: ['https://4funtalk-admin.vercel.app/','http://localhost:5175/', 'http://127.0.0.1:5174'], // Allow these local origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
//app.use(cors(corsOptions));
// Example routes for the API
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Server Configuration
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
