const googleFirebase = require('../firebase');
const { v4: uuidv4 } = require('uuid');
const { createMessage } = require('../utils/chat');
const User = require('../models/user');
const mongoose = require('mongoose');

const firebase = googleFirebase();
const database = firebase.firestore();

const getChat = async (req, res, next) => {
  try {
    const { chatId } = req.query;
    const doc = await database.collection('chats').doc(chatId).get();

    res.status(201).json(doc.data());
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const editChat = async (req, res, next) => {
  try {
    const { chatId, userId, status } = req.body;

    const chat = await database.collection('chats').doc(chatId).get();
    await database
      .collection('chats')
      .doc(chatId)
      .set(
        {
          editedAt: +Date.now(),
          matches: { ...chat.data().matches, [userId]: status },
        },
        { merge: true }
      );

    res.status(201).json('Modified.');
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const leaveChat = async (req, res, next) => {
  try {
    const { chatId, userId, partnerId } = req.body;

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    const partner = await User.findOne({
      _id: mongoose.Types.ObjectId(partnerId),
    });

    await database.collection('chats').doc(chatId).set(
      {
        hasLeft: userId,
      },
      { merge: true }
    );

    user.previousConnections.push(partnerId);
    await user.save();

    if (partner) {
      partner.previousConnections.push(userId);
      await partner.save();
    }

    res.status(201).json('Modified.');
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const createChat = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;
    const documentId = uuidv4();

    await database
      .collection('chats')
      .doc(documentId)
      .set({
        id: documentId,
        createdAt: +Date.now(),
        editedAt: +Date.now(),
        deletedAt: +Date.now(),
        matches: { [senderId]: false, [receiverId]: false },
        usersIds: [senderId, receiverId],
        hasLeft: '',
      });
    await createMessage(database, {
      documentId,
      senderId,
      receiverId,
      type: 'initialization',
      text: 'Faceți cunoștință și jucați-vă frumos. Conversație plăcută!',
    });

    res.status(201).json(documentId);
  } catch (error) {
    res.status(400).json(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { documentId, text, senderId, receiverId, type } = req.body;
    await createMessage(database, {
      documentId,
      senderId,
      receiverId,
      text,
      type: type ? type : 'message',
    });
    res.json('Message sent.');
  } catch (error) {
    res.status(400).json(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.query;

    const querySnapshot = await database
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .limit(30)
      .orderBy('createdAt', 'desc')
      .get();

    const messages = [];
    querySnapshot.forEach((doc) => messages.push(doc.data()));

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = {
  getChat,
  editChat,
  createChat,
  sendMessage,
  getMessages,
  leaveChat,
};
