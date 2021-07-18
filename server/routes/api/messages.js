const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const { onlineUsers } = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    let conversation = await Conversation.findByPk(conversationId);

    if (conversation) {
      if (
        conversation.user1Id === senderId ||
        conversation.user2Id === senderId
      ) {
        const message = await Message.create({
          senderId,
          text,
          conversationId,
        });

        return res.json({ message, sender });
      } else {
        res.status(403).json({ error: "invalid conversationId" });
      }
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    conversation = await Conversation.findConversation(senderId, recipientId);

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers[sender.id]) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/read", async (req, res, next) => {
  try {
    const { conversationId, otherUserId } = req.body;
    const conversation = await Conversation.findByPk(conversationId);
    if (req.user) {
      if (
        conversation.user1Id === req.user.id ||
        conversation.user2Id === req.user.id
      ) {
        const messages = await Message.update(
          { read: true },
          { where: { conversationId, senderId: otherUserId, read: false } }
        );
        res.json(messages);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
