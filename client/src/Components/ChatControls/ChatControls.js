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
				<button className="emoji-btn">
					<GrEmoji />
				</button>
			) : (
				<BsFillMicFill className="animated-mic" />
			)}

			<div className="messages-input-container">
				{true ? (
					<span className="message-input" role="textbox" contentEditable></span>
				) : !true ? (
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
						<span>8 messages selected</span>
						<button className="delete-messages-btn">
							<BsTrash />
						</button>
					</div>
				)}
			</div>
			<button className="voice-note-btn" draggable>
				{true ? <BsFillMicFill /> : <BiSend />}
			</button>
			{!true ? (
				<Picker pickerStyle={emojiPickerStyle} disableAutoFocus={true} disableSearchBar={true} />
			) : null}
		</>
	);
}

export default ChatControls;
