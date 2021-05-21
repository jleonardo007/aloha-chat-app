import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../theme-context";

import Messages from "../Messages/Messages";
import ChatControls from "../ChatControls/ChatControls";
import Backgrounds from "../Backgrounds/Backgrounds";
import Theme from "../Theme/Theme";

import socketClient from "../../socket-client";
import talk from "../../chat-icons/charla.png";
import "./ChatPanel.css";

function ChatPanel(props) {
  const theme = useContext(ThemeContext);
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

  return (
    <section
      className="chat-panel"
      style={{ backgroundColor: theme.background, color: theme.fontColor }}
    >
      {props.settingOption === "no-render-options" ? (
        props.chatInfo
      ) : (
        <div className="settings-components-container">
          {props.settingOption === "profile-settings" ? (
            props.profile
          ) : props.settingOption === "background-settings" ? (
            <Backgrounds
              dispatch={props.dispatch}
              setChatConfigObject={props.setChatConfigObject}
            />
          ) : (
            props.settingOption === "theme-settings" && <Theme dispatch={props.dispatch} />
          )}
        </div>
      )}

      {!props.friend ? (
        <div className="no-chat">
          <div className="no-chat-container">
            <span>Talk to somebody</span>
            <img src={talk} alt="Start talk" loading="lazy" />
          </div>
        </div>
      ) : (
        <div className="chat" data-testid="chat">
          <div className="friend-container">{props.friendComponent}</div>
          <div className="messages-container">
            <Messages
              userId={props.user.id}
              friendId={props.friend.id}
              sentMessage={chatMessagesObject.sentMessage}
              receivedMessage={chatMessagesObject.receivedMessage}
              chatConfigObject={props.chatConfigObject}
              setChatConfigObject={props.setChatConfigObject}
            />
          </div>
          <div className="chat-controls-container">
            <ChatControls
              friend={props.friend}
              user={props.user}
              setSentMessage={setChatMessagesObject}
              chatConfigObject={props.chatConfigObject}
              setChatConfigObject={props.setChatConfigObject}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default ChatPanel;
