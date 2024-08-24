import { StatusCodes } from "http-status-codes";
import { inviteModel } from "~/models/InviteModel"
import { userModel } from "~/models/userModel";
import { connectedUsers, io } from "~/providers/Socket";
import ApiError from "~/utils/ApiError";

// [POST] /invites/add-invite
const addInvite = async (userId, newInvite) => {
  try {
    const dataNewInvite = {
      ...newInvite,
      invitedBy: userId,
    }

    let invitedUser = await userModel.findByEmail(newInvite.invitedUserEmail);

    if (!invitedUser) {
        // Người dùng chưa tồn tại, gửi email mời tham gia Trello
        sendInviteEmail(newInvite.invitedUserEmail);
    }

    const existingInvite = await inviteModel.findInvite(newInvite.boardId, newInvite.invitedUserEmail)
    if (existingInvite) {
      throw new ApiError(StatusCodes.CONFLICT, 'User has already been invited to this board.');
    }

    const createInvite = await inviteModel.addInvite(dataNewInvite)
    const invite = await inviteModel.findOneById(
      createInvite.insertedId.toString()
    )

    if (invitedUser) {
      const socketId = connectedUsers[invitedUser._id.toString()];
      if (socketId) {
        io.emit('invite-received', invite);
      }
    }
    // res.status(200).json({ message: 'Invitation sent' });
    return invite
  } catch (error) {
    throw error
  }
}

// [GET] /invites/:id
const detailInvite = async (inviteId) => {
  try {
    const invite = await inviteModel.getDetail(inviteId)

    return invite
  } catch (error) {
    throw error
  }
}

// [GET] /invites
const getAllInvite = async (email, isReading) => {
  try {
    const invites = await inviteModel.findOneByEmail(email, isReading)

    return invites
  } catch (error) {
    throw error
  }
}

// [PUT] /invites/:id
const updateInvite = async (inviteId, email, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const invite = await inviteModel.update(inviteId, email, updateData)
    return invite
  } catch (error) {
    throw error
  }
}

export const inviteService = {
  addInvite,
  detailInvite,
  updateInvite,
  getAllInvite
}
