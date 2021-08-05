import { useContext } from "react";
import { ThemeContext } from "../../theme-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import useVoiceNote from "./hooks";
import "./styles.css";

export default function VoiceNote({ message }) {
  const theme = useContext(ThemeContext);
  const { voiceNoteState, voiceNoteRef, progressBarRef, playVoiceNoteButton } =
    useVoiceNote(message);

  return (
    <div
      className={`voice-note-container ${
        message.status === "send" ? "message-send" : "message-received"
      }`}
      style={{
        backgroundColor: message.status === "send" ? theme.bubbleSend : theme.bubbleReceived,
      }}
    >
      <div className={`${message.status === "send" ? "voice-note-send " : "voice-note-received "}`}>
        <div className="user-avatar" style={{ backgroundImage: `url(${message.from.avatar})` }} />
        <div className="voice-note">
          {!voiceNoteState.toggleButton ? (
            <button
              className="play-voice-note-btn"
              aria-label="play voice note"
              style={{ color: theme.primaryColor }}
              onClick={() => playVoiceNoteButton()}
            >
              <FontAwesomeIcon icon={faPlay} />
            </button>
          ) : (
            <button
              className="play-voice-note-btn"
              aria-label="pause voice note"
              style={{ color: theme.primaryColor }}
              onClick={() => playVoiceNoteButton()}
            >
              <FontAwesomeIcon icon={faPause} />
            </button>
          )}

          <div className="audio-progress-bar" style={{ backgroundColor: theme.secondaryColor }}>
            <div
              className="progress-bar-indicator"
              ref={progressBarRef}
              style={{ backgroundColor: theme.primaryColor }}
            ></div>
          </div>
          <audio ref={voiceNoteRef} src={message.content} data-testid="voice-note"></audio>
        </div>
      </div>
      <p className="voice-note-status">
        <span className="voice-note-duration">
          {voiceNoteState.minutes}:
          {voiceNoteState.seconds >= 10 ? voiceNoteState.seconds : `0${voiceNoteState.seconds}`}
        </span>
        <span className="time-label">{message.time.hours}</span>:
        <span className="time-label">{message.time.minutes}</span>{" "}
        <span className="time-label">
          {message.time.hours >= 12 && message.time.hours <= 23 ? " PM" : " AM"}
        </span>
        {message.status === "send" && (
          <span className="message-status-label">
            <FontAwesomeIcon
              icon={faCheckDouble}
              className={
                message.seenByFriend
                  ? "seen-status-color"
                  : voiceNoteState.seenByFriend
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
