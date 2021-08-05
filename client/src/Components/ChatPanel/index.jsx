import { useEffect, useContext } from "react";
import { ThemeContext } from "../../theme-context";
import Messages from "../Messages";
import ChatControls from "../ChatControls";
import Backgrounds from "../Backgrounds";
import Theme from "../Theme";
import useChat from "./hooks";
import talk from "../../chat-icons/charla.png";
import "./styles.css";

export default function ChatPanel(props) {
  const theme = useContext(ThemeContext);
  const { chatMessagesObject, setChatMessagesObject } = useChat(props);

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
  });

  return (
    <section
      className="chat-panel"
      style={{ backgroundColor: theme.background, color: theme.fontColor }}
    >
      {props.settingOption === "no-render-options" ? (
        props.ChatInfo
      ) : (
        <div className="settings-components-container">
          {props.settingOption === "profile-settings" ? (
            props.Profile
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
          <div className="friend-container">{props.Friend}</div>
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
              chatConfigObject={props.chatConfigObject}
              setChatConfigObject={props.setChatConfigObject}
              setChatMessagesObject={setChatMessagesObject}
            />
          </div>
        </div>
      )}
    </section>
  );
}
