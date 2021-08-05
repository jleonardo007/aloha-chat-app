import { useContext } from "react";
import { ThemeContext } from "../../theme-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faCheck } from "@fortawesome/free-solid-svg-icons";
import Picker from "emoji-picker-react";
import useNameSettings from "./hooks";
import "./styles.css";

const emojiPickerStyle = {
  width: "100%",
  position: "absolute",
  top: "10%",
  left: "90%",
  zIndex: "2",
  boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.4)",
};

export default function NameSettings({ userName, changeUserName }) {
  const theme = useContext(ThemeContext);
  const { nameSettings, ...handlers } = useNameSettings();

  return (
    <div className="name-settings-container" data-testid="name-settings">
      <form className="name-settings" onSubmit={(e) => changeUserName(e, nameSettings.newName)}>
        <input
          name="change-name"
          type="text"
          className="change-name-input"
          aria-label="change name input"
          placeholder={userName}
          maxLength={30}
          required
          value={nameSettings.newName}
          onChange={(e) => handlers.selectUserName(e)}
        />
        <button
          type="button"
          className="emoji-button"
          aria-label="emoji button"
          onClick={handlers.toggleEmojiPicker}
          style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
        >
          <FontAwesomeIcon icon={faSmile} />
        </button>
        <button
          id="change-name"
          type="submit"
          className="change-name-btn"
          aria-label="change name button"
          style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </form>
      {nameSettings.toggleEmojiPicker && (
        <div className="emoji-picker" data-testid="emoji-picker">
          <Picker
            pickerStyle={emojiPickerStyle}
            disableAutoFocus={true}
            disableSearchBar={true}
            onEmojiClick={handlers.addEmoji}
          />
        </div>
      )}
    </div>
  );
}
