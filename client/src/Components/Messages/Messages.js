import { BiCheckDouble } from "react-icons/bi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import mockMessages from "../../test_utils/mockMessages";

import "./Messages.css";

function TextMessages({ status, content }) {
	return (
		<p className={`${status === "send" ? "message-send" : "message-received"}`}>
			{content}
			<span className="message-status-label">
				<BiCheckDouble className={!true ? "seen-status-color" : null} />
			</span>
		</p>
	);
}

function VoiceNote({ user, message }) {
	return (
		<div
			className={`voice-note-container ${
				message.status === "send" ? "message-send" : "message-received"
			}`}
		>
			<div className={`${message.status === "send" ? "voice-note-send " : "voice-note-received "}`}>
				<img src={user.avatar} alt={user.name} className="user-avatar" />
				<div className="voice-note">
					<span>
						{true ? <BsPlayFill className="play-btn" /> : <BsPauseFill className="pause-btn" />}
					</span>
					<div className="audio-progress-bar">
						<div className="progress-bar-indicator"></div>
					</div>
					<audio src={message.content}></audio>
				</div>
			</div>
			<p className="voice-note-status">
				<span className="voice-note-duration">0:50</span>
				<span className="message-status-label">
					<BiCheckDouble className={!true ? "seen-status-color" : null} />
				</span>
			</p>
		</div>
	);
}

function Messages(/*{ messages }*/) {
	return (
		<ul className="messages">
			{mockMessages.map((message, index) => {
				return (
					<li className="message" key={index}>
						{!true ? <input type="checkbox" className="select-box" /> : null}

						{message.type === "text" ? (
							<TextMessages status={message.status} content={message.content} />
						) : message.type === "voice-note" ? (
							<VoiceNote user={message.user} message={message} />
						) : (
							<p> Invalid message content. </p>
						)}
					</li>
				);
			})}
		</ul>
	);
}

export default Messages;
