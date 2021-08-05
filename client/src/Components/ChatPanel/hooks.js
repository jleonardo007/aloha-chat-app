import { useState, useEffect } from "react";
import socketClient from "../../socket-client";

export default function useChat(props) {
  const [chatMessagesObject, setChatMessagesObject] = useState({
    sentMessage: null,
    receivedMessage: null,
    undeliveredMessages: [],
  });

  useEffect(() => {
    if (!props.user.id) socketClient.emit("new-user", props.user);

    socketClient.on("user-connected", (user) => {
      props.dispatch({
        type: "USER_CONNECTED",
        user,
      });
    });

    return () => {
      socketClient.off("user-connected");
    };
  });

  useEffect(() => {
    socketClient.on("new-message", (message) => {
      if (props.friend)
        setChatMessagesObject((prevState) => {
          if (message.from.id === props.friend.id)
            return {
              ...prevState,
              receivedMessage: { ...message, status: "received" },
            };
          else
            return {
              ...prevState,
              undeliveredMessages: [
                ...prevState.undeliveredMessages,
                { ...message, status: "received" },
              ],
            };
        });
      else
        setChatMessagesObject((prevState) => {
          return {
            ...prevState,
            undeliveredMessages: [
              ...prevState.undeliveredMessages,
              { ...message, status: "received" },
            ],
          };
        });
    });

    return () => {
      socketClient.off("new-message");
    };
  }, [props.friend]);

  useEffect(() => {
    if (props.friend)
      setChatMessagesObject((prevState) => {
        if (prevState.undeliveredMessages.some((message) => message.from.id === props.friend.id))
          return {
            ...prevState,
            receivedMessage: prevState.undeliveredMessages.filter(
              (message) => message.from.id === props.friend.id
            ),
            undeliveredMessages: prevState.undeliveredMessages.filter(
              (message) => message.from.id !== props.friend.id
            ),
          };
        else return prevState;
      });

    return () => {
      setChatMessagesObject((prevState) => {
        if (!prevState.sentMessage && !prevState.receivedMessage) return prevState;
        else
          return {
            ...prevState,
            sentMessage: null,
            receivedMessage: null,
          };
      });
    };
  }, [props.friend]);

  useEffect(() => {
    if (
      props.chatConfigObject.shouldEmptyChat ||
      props.chatConfigObject.shouldDeleteSelectedMessages
    )
      setChatMessagesObject((prevState) => {
        return {
          ...prevState,
          sentMessage: null,
          receivedMessage: null,
        };
      });
  }, [props.chatConfigObject]);

  return {
    chatMessagesObject,
    setChatMessagesObject,
  };
}
