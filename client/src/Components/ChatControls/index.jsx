import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faMicrophone, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import TextBox from "../TextBox";
import VoiceNoteRecorder from "../VoiceNoteRecorder";
import useChatControls from "./hooks";
import "./styles.css";

export default function ChatControls({
  friend,
  user,
  chatConfigObject,
  setChatConfigObject,
  setChatMessagesObject,
}) {
  const { controls, ...handlers } = useChatControls(
    friend,
    user,
    chatConfigObject,
    setChatConfigObject,
    setChatMessagesObject
  );

  return (
    <>
      <button
        className="emoji-btn"
        aria-label="emoji button"
        disabled={controls.mediaStream ? true : false}
        onClick={handlers.toggleEmojiPicker}
      >
        <FontAwesomeIcon icon={faSmile} />
      </button>
      <TextBox
        user={user}
        friend={friend}
        controls={controls}
        chatConfigObject={chatConfigObject}
        sendMessage={handlers.sendMessage}
        deleteSelectedMessages={handlers.deleteSelectedMessages}
        createTextMessage={handlers.createTextMessage}
      />
      {controls.toggleVoiceNoteRecorder ? (
        <VoiceNoteRecorder
          user={user}
          friend={friend}
          controls={controls}
          sendMessage={handlers.sendMessage}
          closeRecorder={handlers.closeRecorder}
        />
      ) : (
        <>
          {controls.toggleVoiceNoteButton ? (
            <button
              className="voice-note-btn"
              aria-label="send message button"
              onClick={() => handlers.sendMessage({ content: controls.textContent, type: "text" })}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          ) : (
            <button
              className="voice-note-btn"
              aria-label="voice note button"
              onClick={handlers.requestUserMedia}
            >
              <FontAwesomeIcon icon={faMicrophone} />
            </button>
          )}
        </>
      )}
    </>
  );
}
