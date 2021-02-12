const User = require('../models/user');
const mongoose = require('mongoose');

const createUser = (req, res, _next) => {
  try {
    const user = new User(req.body);

    user.save((_error, user) => {
      res.status(201).json(user);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteUser = async (req, res, _next) => {
  try {
    await User.remove({ facebookId: req.body.id });

    res.status(204).json('Deleted.');
  } catch (error) {
    res.status(400).json(error);
  }
};

const getUser = async (req, res, _next) => {
  try {
    const { facebookId, id } = req.query;

    if (facebookId || id) {
      const searchQuery = facebookId
        ? { facebookId }
        : { _id: mongoose.Types.ObjectId(id) };
      const user = await User.findOne(searchQuery);

      res.json(user);
    } else {
      throw new Error('Invalid payload.');
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const getRandomMatch = async (req, res, _next) => {
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
              // .concat(user.previousConnections)
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
    const { senderId, receiverId } = req.body;

    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(senderId),
    });

    if (user.chatInvites.includes(receiverId)) {
      return res
        .status(304)
        .json(
          "You can't send an invitation to this user because he already sent you an invite."
        );
    }

    user.chatRequests.push(receiverId);

    const invitedUser = await User.findOne({
      _id: receiverId,
    });
    invitedUser.chatInvites.push(senderId);

    await user.save();
    await invitedUser.save();

    res.status(202).json('Saved.');
  } catch (error) {
    res.status(400).json(error);
  }
};

const rejectUser = async (req, res, _next) => {
  try {
    const { userId, rejectedUserId } = req.body;
    const user = await User.findOne({
      _id: userId,
    });
    user.rejectedPeople.push(rejectedUserId);

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
      user.chatInvites
        .filter((id, index, array) => index === array.indexOf(id))
        .map(async (id) => {
          const user = await User.findOne({
            _id: mongoose.Types.ObjectId(id),
          });
          if (!user) return;
          const { _id, firstName, lastName, avatar } = user;

          return {
            _id,
            firstName,
            lastName,
            avatar,
          };
        })
        .filter((user) => !!user)
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
  getRandomMatch,
  rejectUser,
  sendRequest,
  getNotifications,
  acceptRequest,
  declineRequest,
  updateUser,
  deleteUser,
};
