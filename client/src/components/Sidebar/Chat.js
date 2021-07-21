import React from "react";
import { Box, Typography } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { useDispatch } from "react-redux";
import { theme } from "../../themes/theme";
import { markMessagesRead } from "../../store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.spacing(5),
    height: theme.spacing(40),
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: theme.spacing(5),
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  notification: {
    height: theme.spacing(10),
    width: theme.spacing(10),
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(5),
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.spacing(5),
  },
}));

const Chat = ({ conversation }) => {
  const classes = useStyles(theme);
  const dispatch = useDispatch();
  const { otherUser, notificationCount } = conversation;

  const handleClick = async () => {
    await dispatch(setActiveChat(otherUser.username));
    await dispatch(markMessagesRead(conversation));
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

export default Chat;
