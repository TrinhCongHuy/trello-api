// // src/providers/socket.js
// import { Server } from 'socket.io'

// const initSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",  
//       methods: ["GET", "POST"],
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log(`New client connected: ${socket.id}`);

//     socket.on('joinRoom', (email) => {
//       socket.join(email);  
//       console.log(`${email} đã tham gia room ${email}`);

//       const room = io.sockets.adapter.rooms.get(email);
//       console.log("room", room);
//       if (room) {
//         const socketsInRoom = Array.from(room);
//         console.log(`Các socket ids trong room ${email}: ${socketsInRoom}`);
//       } else {
//         console.log(`Room ${email} không tồn tại.`);
//       }
//     });

//     // Lắng nghe sự kiện invite người dùng
//     socket.on('inviteUserToBoard', (data) => {
//       console.log('Data received:', data);
//       const roomExists = io.sockets.adapter.rooms.has(data.email);
//       console.log(`Room ${data.email} exists: ${roomExists}`);

//       if (roomExists) {
//         // Thông báo đến người dùng qua email (nếu đã kết nối) về việc mời tham gia board
//         socket.to(data.email).emit('invitationReceived', {
//           boardId: data.boardId,
//           email: data.email,
//         });
//       }
//     });

//     socket.on('acceptInvitation', (data) => {
//       console.log('Thành viên đã chấp nhận lời mời:', data);
  
//       // Thực hiện các hành động cần thiết khi lời mời được chấp nhận
//       // Ví dụ: cập nhật cơ sở dữ liệu, thêm vào danh sách board của thằng B
  
//       // Thông báo cho thằng A về việc thằng B đã chấp nhận lời mời (nếu cần)
//       socket.to(data.email).emit('invitationAccepted', {
//         boardId: data.boardId,
//       });
//     });

//     socket.on('disconnect', () => {
//       console.log(`Client disconnected: ${socket.id}`);
//     });
//   });

//   return io;
// }

// export default initSocket;


import { Server } from 'socket.io';

// Tạo server HTTP (giả sử bạn đã có một Express app hoặc server khác)
const server = require('http').createServer(); // Bạn cần đảm bảo server HTTP được tạo trước đó
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Đặt URL frontend của bạn ở đây
    methods: ["GET", "POST"],
    credentials: true // Nếu bạn cần gửi cookie, bạn có thể bật tùy chọn này
  }
});

// Đối tượng để lưu trữ socket ID theo user ID
const connectedUsers = {};

// Sự kiện kết nối socket
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Sự kiện khi user join (đăng ký socket ID với user ID)
  socket.on('join', ({ userId }) => {
    connectedUsers[userId] = socket.id;
    console.log(`User with ID ${userId} connected with socket ID ${socket.id}`);
  });

  // Xử lý khi người dùng A mời người dùng B vào board
  socket.on('inviteUserToBoard', (data) => {
    console.log('Data received:', data);
    const { inviterId, inviteeId, boardId } = data;

    // Kiểm tra xem người dùng B có đang kết nối không
    const inviteeSocketId = connectedUsers[inviteeId];
    if (inviteeSocketId) {
      // Gửi thông báo mời tham gia board đến người dùng B
      io.to(inviteeSocketId).emit('invitationReceived', {
        boardId,
        inviterId,
        message: `You have been invited to board ${boardId} by user ${inviterId}.`,
      });
    } else {
      console.log(`User ${inviteeId} is not connected`);
    }
  });

  // Xử lý khi người dùng B chấp nhận lời mời
  socket.on('acceptInvitation', (data) => {
    console.log('Invitation accepted:', data);
    const { boardId, inviteeId } = data;

    // Gửi thông báo cho người dùng A về việc lời mời đã được chấp nhận
    const inviterSocketId = connectedUsers[inviterId];
    if (inviterSocketId) {
      io.to(inviterSocketId).emit('invitationAccepted', {
        boardId,
        message: `User ${inviteeId} has accepted the invitation to board ${boardId}.`,
      });
    }
  });

  // Sự kiện khi socket disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Xóa socket ID khỏi danh sách khi ngắt kết nối
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId];
        console.log(`Removed user ID ${userId} from connected users`);
        break;
      }
    }
  });
});

// Xuất đối tượng io để sử dụng ở nơi khác
export { io, connectedUsers };
