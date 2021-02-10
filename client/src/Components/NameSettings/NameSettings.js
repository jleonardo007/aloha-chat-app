import { useState } from "react";

import Picker from "emoji-picker-react";
import { GrEmoji, GrCheckmark } from "react-icons/gr";

import "./NameSettings.css";

const emojiPickerStyle = {
	width: "100%",
	position: "absolute",
	top: "10%",
	left: "90%",
	zIndex: "1",
	boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.4)",
};

function NameSettings({ user, newProfile, setNewProfile }) {
	const [inputValue, setInputValue] = useState("");
	const [toggleEmojiPicker, setToogleEmojiPicker] = useState(false);

	function handleEmojiButtonClick() {
		setToogleEmojiPicker(!toggleEmojiPicker);
	}

	function handleChangeNameButtonClick() {
		setNewProfile({
			name: inputValue,
			avatar: newProfile.avatar ? newProfile.avatar : user.avatar,
		});
	}

	function handleChange(e) {
		setInputValue(e.target.value);
	}

	return (
		<div className="name-settings-container" data-testid="name-settings">
			<div className="name-settings">
				<input
					type="text"
					className="change-name-input"
					aria-label="change name input"
					placeholder={user.name}
					maxLength={30}
					required
					value={inputValue}
					onChange={(e) => handleChange(e)}
				/>
				<button className="emoji-button" aria-label="emoji button" onClick={handleEmojiButtonClick}>
					<GrEmoji />
				</button>
				<button
					className="change-name-btn"
					aria-label="change name button"
					onClick={handleChangeNameButtonClick}
				>
					<GrCheckmark />
				</button>
			</div>
			{toggleEmojiPicker ? (
				<div className="emoji-picker" data-testid="emoji-picker">
					<Picker pickerStyle={emojiPickerStyle} disableAutoFocus={true} disableSearchBar={true} />
				</div>
			) : null}
		</div>
	);
}

export default NameSettings;
