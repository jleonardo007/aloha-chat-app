import { useContext } from "react";
import { ThemeContext } from "../../theme-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import useTextMessage from "./hooks";
import "./styles.css";

export default function TextMessage({ message }) {
  const theme = useContext(ThemeContext);
  const textMessageState = useTextMessage(message);

  return (
    <div
      className={`${message.status === "send" ? "message-send" : "message-received"}`}
      style={{
        backgroundColor: message.status === "send" ? theme.bubbleSend : theme.bubbleReceived,
      }}
      data-testid="text-message-content"
    >
      <p className="text-message-content">{message.content}</p>
      <p className="message-info-label">
        <span className="time-label">{message.time.hours}</span>:
        <span className="time-label">{message.time.minutes}</span>{" "}
        <span className="time-label">
          {message.time.hours >= 12 && message.time.hours <= 23 ? "PM" : "AM"}
        </span>
        {message.status === "send" && (
          <span className="message-status-label">
            <FontAwesomeIcon
              icon={faCheckDouble}
              className={
                message.seenByFriend
                  ? "seen-status-color"
                  : textMessageState.seenByFriend
                  ? "seen-status.color"
                  : ""
              }
              data-testid="message status"
            />
          </span>
        )}
      </p>
    </div>
  );
}
