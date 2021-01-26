const { v4: uuidv4 } = require('uuid');

const createMessage = async (
  database,
  { documentId, senderId, receiverId, type = 'message', text }
) => {
  const messageId = uuidv4();

  const response = await database
    .collection('chats')
    .doc(documentId)
    .collection('messages')
    .doc(messageId)
    .set({
      id: messageId,
      senderId,
      receiverId,
      type,
      text,
      createdAt: +Date.now(),
      editedAt: +Date.now(),
      deletedAt: +Date.now(),
    });

  return response;
};

module.exports = { createMessage };
