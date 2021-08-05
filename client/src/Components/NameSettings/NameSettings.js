import { useState, useContext } from "react";
import { ThemeContext } from "../../theme-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faCheck } from "@fortawesome/free-solid-svg-icons";
import Picker from "emoji-picker-react";
import "./NameSettings.css";

const emojiPickerStyle = {
  width: "100%",
  position: "absolute",
  top: "10%",
  left: "90%",
  zIndex: "2",
  boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.4)",
};

function NameSettings({ user, newProfile, setNewProfile }) {
  const theme = useContext(ThemeContext);
  const [inputValue, setInputValue] = useState("");
  const [toggleEmojiPicker, setToogleEmojiPicker] = useState(false);

  function handleEmojiButtonClick() {
    setToogleEmojiPicker(!toggleEmojiPicker);
  }

  function handleChangeName(e) {
    e.preventDefault();
    setNewProfile({
      name: inputValue,
      avatar: newProfile.avatar ? newProfile.avatar : user.avatar,
    });
  }

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  function handleAddEmoji(e, emojiObject) {
    setInputValue((prevState) => `${prevState}${emojiObject.emoji}`);
  }

  return (
    <div className="name-settings-container" data-testid="name-settings">
      <form className="name-settings" onSubmit={(e) => handleChangeName(e)}>
        <input
          name="change-name"
          type="text"
          className="change-name-input"
          aria-label="change name input"
          placeholder={user.name}
          maxLength={30}
          required
          value={inputValue}
          onChange={(e) => handleChange(e)}
        />
        <button
          type="button"
          className="emoji-button"
          aria-label="emoji button"
          onClick={handleEmojiButtonClick}
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
      {toggleEmojiPicker && (
        <div className="emoji-picker" data-testid="emoji-picker">
          <Picker
            pickerStyle={emojiPickerStyle}
            disableAutoFocus={true}
            disableSearchBar={true}
            onEmojiClick={handleAddEmoji}
          />
        </div>
      )}
    </div>
  );
}

export default NameSettings;
