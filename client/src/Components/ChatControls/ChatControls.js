import { GrEmoji } from "react-icons/gr";
import { BsFillMicFill } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";

import Picker from "emoji-picker-react";

import "./ChatControls.css";

const emojiPickerStyle = {
	width: "65%",
	position: "absolute",
	bottom: "12%",
	zIndex: "1",
	boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.4)",
};

function ChatControls() {
	return (
		<>
			{true ? (
				<button className="emoji-btn" aria-label="emoji button">
					<GrEmoji />
				</button>
			) : (
				<BsFillMicFill className="animated-mic" data-testid="animated-mic" />
			)}
			<div className="messages-input-container">
				{true ? (
					<span className="message-input" role="textbox" contentEditable></span>
				) : true ? (
					<div className="cancel-dialog">
						<p>
							<span>
								<FaAngleLeft />
							</span>
							Swipe to cancel
						</p>
					</div>
				) : (
					<div className="selected-messages">
						<p>
							<span aria-label="selected messages counter">8</span> messages selected
						</p>
						<button className="delete-messages-btn" aria-label="delete messages button">
							<BsTrash />
						</button>
					</div>
				)}
			</div>
			<button className="voice-note-btn" draggable aria-label="voice note button">
				{true ? <BsFillMicFill data-testid="mic-icon" /> : <BiSend data-testid="send-icon" />}
			</button>
			{!true ? (
				<Picker
					pickerStyle={emojiPickerStyle}
					disableAutoFocus={true}
					disableSearchBar={true}
					data-testid="emoji-picker"
				/>
			) : null}
		</>
	);
}

export default ChatControls;
