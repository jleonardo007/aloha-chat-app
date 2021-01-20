import { GrEmoji } from "react-icons/gr";
import { BsFillMicFill } from "react-icons/bs";
import { BiSend } from "react-icons/bi";

import "./ChatControls.css";

function ChatControls() {
	return (
		<>
			<button className="emoji-btn">
				{true ? <GrEmoji /> : <BsFillMicFill className="animated-mic" />}
			</button>
			<div className="messages-input-container">
				<span className="message-input" role="textbox" contentEditable></span>
			</div>
			<button className="voice-note-btn">{true ? <BsFillMicFill /> : <BiSend />}</button>
		</>
	);
}

export default ChatControls;
