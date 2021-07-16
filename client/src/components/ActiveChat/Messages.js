import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = ({ messages, otherUser, userId }) => {
  const sentMessages = messages.filter(
    (message) => message.senderId === userId
  );
  const unreadMessagesCount = sentMessages.filter(
    (message) => !message.read
  ).length;
  const lastReadMessageId =
    unreadMessagesCount < sentMessages.length
      ? sentMessages[sentMessages.length - 1 - unreadMessagesCount].id
      : 0;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        const isLastReadMessage = message.id === lastReadMessageId;

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            isLastReadMessage={isLastReadMessage}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
