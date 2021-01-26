const User = require('../models/user');
const mongoose = require('mongoose');

const createUser = (req, res, next) => {
  try {
    const user = new User(req.body);

    user.save((error, user) => {
      res.status(201).json(user);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { facebookId, id } = req.query;
    if (facebookId) {
      const user = await User.findOne({ facebookId });
      res.json(user);
    } else if (id) {
      const user = await User.findOne({ _id: id });
      res.json(user);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const getRandomUser = async (req, res, _next) => {
  try {
    const { id } = req.query;

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    const match = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: user.rejectedPeople
              .concat(user.chatRequests)
              .concat(user.chatInvites)
              .concat(user.previousConnections)
              .concat(id)
              .map((id) => mongoose.Types.ObjectId(id)),
          },
          gender: user.interest,
        },
      },
      {
        $sample: { size: 1 },
      },
    ]);

    res.json(match);
  } catch (error) {
    res.status(400).json(error);
  }
};

const sendRequest = async (req, res, _next) => {
  try {
    const { current_user_id, invited_user_id } = req.body;
    const user = await User.findOne({
      _id: current_user_id,
    });
    user.chatRequests.push(invited_user_id);

    const invitedUser = await User.findOne({
      _id: invited_user_id,
    });
    invitedUser.chatInvites.push(current_user_id);

    await user.save();
    await invitedUser.save();

    res.status(204).json('Saved.');
  } catch (error) {
    res.status(400).json(error);
  }
};

const rejectUser = async (req, res, _next) => {
  try {
    const { current_user_id, rejected_user_id } = req.body;
    const user = await User.findOne({
      _id: current_user_id,
    });
    user.rejectedPeople.push(rejected_user_id);

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getNotifications = async (req, res, _next) => {
  try {
    const { id } = req.query;

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    const notifications = await Promise.all(
      user.chatInvites.map(async (id) => {
        const { _id, firstName, lastName, avatar } = await User.findOne({
          _id: mongoose.Types.ObjectId(id),
        });
        return {
          _id,
          firstName,
          lastName,
          avatar,
        };
      })
    );

    res.json(notifications);
  } catch (error) {
    res.status(400).json(error);
  }
};

const declineRequest = async (req, res, _next) => {
  try {
    const { id, from_id } = req.body;

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    user.chatInvites = user.chatInvites.filter(
      (receiverId) => receiverId !== from_id
    );
    user.rejectedPeople.push(from_id);

    const sender = await User.findOne({
      _id: mongoose.Types.ObjectId(from_id),
    });
    sender.chatRequests = sender.chatRequests.filter(
      (senderId) => senderId !== id
    );

    await user.save();
    await sender.save();

    res.status(204).json('The request has been declined.');
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const acceptRequest = async (req, res, _next) => {
  try {
    const { id, from_id, chatId } = req.body;

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    user.chatInvites = user.chatInvites.filter(
      (receiverId) => receiverId !== from_id
    );

    const sender = await User.findOne({
      _id: mongoose.Types.ObjectId(from_id),
    });
    sender.chatRequests = sender.chatRequests.filter(
      (senderId) => senderId !== id
    );

    // TODO
    user.currentChatId = chatId;
    sender.currentChatId = chatId;

    await user.save();
    await sender.save();

    res.status(204).json('The request has been declined.');
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateUser = async (req, res, _next) => {
  try {
    const user = await User.findOne({
      _id: req.body._id,
    });

    Object.keys(req.body).forEach((key) => {
      if (typeof user[key] === 'string' || typeof user[key] === 'number') {
        user[key] = req.body[key];
      } else if (Array.isArray(user[key])) {
        user[key] = user[key].concat(req.body[key]);
      }
    });

    await user.save();

    res.status(204).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  createUser,
  getUser,
  getRandomUser,
  rejectUser,
  sendRequest,
  getNotifications,
  acceptRequest,
  declineRequest,
  updateUser,
};
