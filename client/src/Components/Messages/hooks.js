import { useState, useEffect, useRef } from "react";
import socketClient from "../../socket-client";
import { mockMessages } from "../../test_utils/mockData";

export default function useMessages(
  userId,
  friendId,
  sentMessage,
  receivedMessage,
  chatConfigObject,
  setChatConfigObject
) {
  const messageRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    messageRef.current.scrollIntoView(false);
  });

  useEffect(() => {
    if (process.env.NODE_ENV === "test") setMessages(mockMessages);

    socketClient.emit("get:conversation", { userId, friendId });
    socketClient.on("get:conversation", (messages) => {
      if (Array.isArray(receivedMessage)) setMessages([...messages, ...receivedMessage]);
      else if (receivedMessage) setMessages([...messages, receivedMessage]);
      else setMessages(messages);
    });

    return () => {
      setMessages((prevState) => {
        const notStoredMessages = prevState.filter((message) => !message.isStored);

        if (notStoredMessages.length > 0)
          socketClient.emit("save-conversation", {
            userId,
            friendId,
            messages: [...notStoredMessages],
            hasDeletedMessages: false,
          });

        return [];
      });

      socketClient.off("get:conversation");
    };
  }, [friendId, userId, receivedMessage]);

  useEffect(() => {
    if (sentMessage) setMessages((prevState) => [...prevState, sentMessage]);
  }, [sentMessage]);

  useEffect(() => {
    if (Array.isArray(receivedMessage))
      setMessages((prevState) => [...prevState, ...receivedMessage]);
    else if (receivedMessage) setMessages((prevState) => [...prevState, receivedMessage]);
  }, [receivedMessage]);

  // eslint-disable-next-line
  useEffect(() => {
    if (messages.length > 0)
      setChatConfigObject((prevState) => {
        if (!prevState.shouldToggleMessageSelector)
          return {
            ...prevState,
            shouldToggleMessageSelector: true,
          };
        else return prevState;
      });

    if (chatConfigObject.shouldEmptyChat) {
      setMessages(() => []);

      setChatConfigObject((prevState) => {
        return {
          ...prevState,
          shouldToggleMessageSelector: false,
          shouldEmptyChat: false,
        };
      });

      socketClient.emit("save-conversation", {
        userId,
        friendId,
        messages: [],
        hasDeletedMessages: true,
      });
    }

    if (chatConfigObject.shouldDeleteSelectedMessages) {
      setMessages((prevState) => prevState.filter((message) => !message.shouldDelete));

      setChatConfigObject((prevState) => {
        return {
          ...prevState,
          shouldDeleteSelectedMessages: false,
        };
      });

      socketClient.emit("save-conversation", {
        userId,
        friendId,
        messages: [...messages.filter((message) => !message.shouldDelete)],
        hasDeletedMessages: true,
      });
    }
  });

  return {
    messages,
    messageRef,
  };
}
