// src/controllers/inviteController.js
// import Invitation from '../models/Invitation.js';
// import User from '../models/User.js';
// import Board from '../models/Board.js';

// export const inviteUser = async (req, res) => {
//   const { boardId, recipientEmail } = req.body;
//   const senderId = req.user._id; // ID của user đã đăng nhập

//   try {
//     // Tìm board và người dùng
//     const board = await Board.findById(boardId);
//     if (!board) return res.status(404).json({ message: 'Board không tồn tại' });

//     const recipient = await User.findOne({ email: recipientEmail });
//     if (!recipient) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     // Tạo lời mời
//     const invitation = new Invitation({
//       board: boardId,
//       sender: senderId,
//       recipientEmail: recipientEmail,
//     });
//     await invitation.save();

//     // Thêm recipient vào room nếu họ đang online
//     const io = req.app.get('socketio');
//     io.to(recipientEmail).emit('invitationReceived', {
//       boardId: boardId,
//       senderEmail: req.user.email,
//     });

//     res.status(200).json({ message: 'Lời mời đã được gửi' });
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// };


// // src/controllers/inviteController.js
// export const acceptInvitation = async (req, res) => {
//     const { invitationId } = req.params;
  
//     try {
//       const invitation = await Invitation.findById(invitationId);
//       if (!invitation) return res.status(404).json({ message: 'Lời mời không tồn tại' });
  
//       // Tìm người nhận và board
//       const recipient = await User.findOne({ email: invitation.recipientEmail });
//       if (!recipient) return res.status(404).json({ message: 'Người dùng không tồn tại' });
  
//       const board = await Board.findById(invitation.board);
//       if (!board) return res.status(404).json({ message: 'Board không tồn tại' });
  
//       // Thêm người nhận vào board
//       board.members.push(recipient._id);
//       await board.save();
  
//       // Cập nhật trạng thái của lời mời
//       invitation.status = 'accepted';
//       await invitation.save();
  
//       // Thông báo cho người gửi rằng lời mời đã được chấp nhận
//       const io = req.app.get('socketio');
//       io.to(invitation.sender._id.toString()).emit('invitationAccepted', {
//         boardId: board._id,
//         recipientEmail: invitation.recipientEmail,
//       });
  
//       res.status(200).json({ message: 'Lời mời đã được chấp nhận' });
//     } catch (err) {
//       res.status(500).json({ message: 'Lỗi server' });
//     }
// };


const { inviteService } = require("~/services/inviteService")
const { StatusCodes } = require("http-status-codes")


// [POST] /invites/add-invite
const createInvite = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const newInvite = req.body
    const invite = await inviteService.addInvite(userId, newInvite)
    res.status(StatusCodes.CREATED).json(invite)
  } catch (error) {
    next(error)
  }
};

// [GET] /invites/:id
const detailInvite = async (req, res, next) => {
  try {
    const inviteId = req.params.id
    const invite = await inviteService.detailInvite(inviteId)

    res.status(StatusCodes.OK).json(invite)
  } catch (error) {
    next(error)
  }
};

// [GET] /invites
const getAllInvite = async (req, res, next) => {
  try {
    const email = req.jwtDecoded.email
    const isReading = req.query.isReading === 'true'
    const invites = await inviteService.getAllInvite(email, isReading)

    res.status(StatusCodes.OK).json(invites)
  } catch (error) {
    next(error)
  }
};

// [PUT] /invites/:id
const updateInvite = async (req, res, next) => {
  try {
    const inviteId = req.params.id
    const email = req.jwtDecoded.email
    const updatedInvite = await inviteService.updateInvite(inviteId, email, req.body)

    res.status(StatusCodes.OK).json(updatedInvite)
  } catch (error) {
    next(error)
  }
};

export const inviteController = {
  createInvite,
  detailInvite,
  updateInvite,
  getAllInvite
};
