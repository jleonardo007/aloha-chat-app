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

function NameSettings({ name }) {
	return (
		<div className="name-settings-container">
			<div className="name-settings">
				<input type="text" className="change-name-input" placeholder={name} maxLength={30} />
				<button className="emoji-button">
					<GrEmoji />
				</button>
				<button className="change-name-btn">
					<GrCheckmark />
				</button>
			</div>
			{!true ? (
				<Picker
					pickerStyle={emojiPickerStyle}
					disableAutoFocus={true}
					disableSearchBar={true}
					data-testid="emoji-picker"
				/>
			) : null}
		</div>
	);
}

export default NameSettings;
