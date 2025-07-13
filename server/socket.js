import Message from './models/Message.js';

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ A user connected:', socket.id);

    // Join unique room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    });

    // Typing indicator
    socket.on('typing', (receiverId) => {
      io.to(receiverId).emit('typing');
    });

    socket.on('stop_typing', (receiverId) => {
      io.to(receiverId).emit('stop_typing');
    });

    // Handle send message
    socket.on('send_message', async ({ senderId, receiverId, message }) => {
      if (!senderId || !receiverId || !message) return;


      const unreadCount = await Message.countDocuments({ receiver: receiverId, isRead: false });

      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message,
        isRead: false,
      });

      /// Notify both sender and receiver in real-time
      io.to(senderId).emit('receive_message', newMessage);
      io.to(receiverId).emit('receive_message', newMessage);

      io.to(receiverId).emit('new_notification', {
        from: senderId,
        count: unreadCount,
        preview: message,
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ A user disconnected:', socket.id);
    });
  });
};

export default socketHandler;
