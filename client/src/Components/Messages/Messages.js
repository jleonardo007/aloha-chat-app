import { useState, useEffect, useRef } from "react";

import TextMessage from "./TextMessage";
import VoiceNote from "./VoiceNote";

import socketClient from "../../socket-client";
import { mockMessages } from "../../test_utils/mockData";
import messagesBackground from "../../chat-icons/messages_bg.png";
import "./Messages.css";

function Messages({
  userId,
  friendId,
  sentMessage,
  receivedMessage,
  chatConfigObject,
  setChatConfigObject,
}) {
  const messageRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messageRef.current) messageRef.current.scrollIntoView(false);
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

  return (
    <ul
      ref={messageRef}
      className="messages"
      aria-label="messages"
      style={{
        backgroundImage: `url(${messagesBackground})`,
        backgroundColor: chatConfigObject.toggleBackgroundColor
          ? chatConfigObject.toggleBackgroundColor
          : chatConfigObject.toggleBackgroundColor
          ? chatConfigObject.toggleBackgroundColor
          : chatConfigObject.backgroundColor,
      }}
    >
      {messages.map((message, index) => (
        <li className="message" key={index} aria-label="message">
          {chatConfigObject.toggleMessageSelector && (
            <input
              type="checkbox"
              className="select-box"
              onClick={(e) => {
                setChatConfigObject((prevState) => {
                  return {
                    ...prevState,
                    selectedMessagesCounter: e.target.checked
                      ? prevState.selectedMessagesCounter + 1
                      : prevState.selectedMessagesCounter - 1,
                  };
                });
                message.shouldDelete = e.target.checked ? true : false;
              }}
            />
          )}

          {message.type === "text" ? (
            <TextMessage message={message} />
          ) : (
            message.type === "voice-note" && <VoiceNote message={message} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default Messages;
