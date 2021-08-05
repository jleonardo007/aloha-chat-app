import TextMessage from "../TextMessage";
import VoiceNote from "../VoiceNote";
import messagesBackground from "../../chat-icons/messages_bg.png";
import useMessages from "./hooks";
import "./styles.css";

export default function Messages({
  userId,
  friendId,
  sentMessage,
  receivedMessage,
  chatConfigObject,
  setChatConfigObject,
}) {
  const { messages, messageRef } = useMessages(
    userId,
    friendId,
    sentMessage,
    receivedMessage,
    chatConfigObject,
    setChatConfigObject
  );

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
