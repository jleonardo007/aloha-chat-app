import { useContext } from "react";
import { ThemeContext } from "../../theme-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Picker from "emoji-picker-react";
import useTextBox from "./hooks";
import "./styles.css";

const emojiPickerStyle = {
  width: "65%",
  position: "absolute",
  bottom: "12%",
  zIndex: "1",
  boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.4)",
};

export default function TextBox({
  controls,
  chatConfigObject,
  createTextMessage,
  sendMessage,
  deleteSelectedMessages,
}) {
  const theme = useContext(ThemeContext);
  const {
    textBoxState,
    messageInputRef,
    selectedMessagesCounterRef,
    setTextBoxState,
    setTextBoxFocus,
  } = useTextBox(controls, chatConfigObject);

  return (
    <>
      {chatConfigObject.toggleMessageSelector ? (
        <div
          className="selected-messages-container"
          style={{ backgroundColor: theme.secondaryColor, color: theme.fontColor }}
        >
          <div className="selected-messages" ref={selectedMessagesCounterRef}>
            <p>
              <span data-testid="selected-messages-counter">
                {chatConfigObject.selectedMessagesCounter}
              </span>{" "}
              messages selected
            </p>
            <button
              className="delete-messages-btn"
              aria-label="delete messages button"
              onClick={() => deleteSelectedMessages()}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="textbox-container"
          style={{ backgroundColor: theme.secondaryColor, color: theme.fontColor }}
        >
          {!textBoxState.content && !chatConfigObject.toggleMessageSelector && (
            <div className="textbox-placeholder" onClick={setTextBoxFocus}>
              <span>Write a message</span>
            </div>
          )}
          <div
            className="textbox-input"
            role="textbox"
            aria-label="message input"
            ref={messageInputRef}
            contentEditable={controls.mediaStream ? false : true}
            onClick={setTextBoxFocus}
            onInput={(e) => createTextMessage(e, null, textBoxState, sendMessage, setTextBoxState)}
          ></div>
        </div>
      )}
      {controls.toggleEmojiPicker && (
        <Picker
          pickerStyle={emojiPickerStyle}
          disableAutoFocus={true}
          disableSearchBar={true}
          data-testid="emoji-picker"
          onEmojiClick={(e, emojiObject) =>
            createTextMessage(e, emojiObject, textBoxState, null, setTextBoxState)
          }
        />
      )}
    </>
  );
}
