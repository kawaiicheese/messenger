import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { markMessageRead } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  notification: {
    height: 20,
    width: 20,
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
}));

const Chat = ({ conversation, setActiveChat, markMessageRead }) => {
  const classes = useStyles();
  const { otherUser, notificationCount: notifC } = conversation;
  const [notificationCount, setNotificationCount] = useState(notifC);

  const handleClick = async () => {
    await setActiveChat(conversation.otherUser.username);
    await markMessageRead(conversation.id);
    setNotificationCount(0);
  };

  return (
    <Box onClick={handleClick} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent
        conversation={conversation}
        notificationCount={notificationCount}
      />
      {notificationCount > 0 && (
        <Typography className={classes.notification}>
          {notificationCount}
        </Typography>
      )}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    markMessageRead: (conversationId) => {
      dispatch(markMessageRead(conversationId));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
