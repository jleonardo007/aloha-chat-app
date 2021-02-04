import { BiCheckDouble } from "react-icons/bi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

import mockMessages from "../../test_utils/mockMessages";
import "./Messages.css";

function TextMessages({ status, content }) {
	return (
		<p
			className={`${status === "send" ? "message-send" : "message-received"}`}
			data-testid="text-message-content"
		>
			{content}
			<span className="message-status-label">
				<BiCheckDouble
					className={!true ? "seen-status-color" : null}
					data-testid="message status"
				/>
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
					<button className="play-voice-note-btn" aria-label="play voice note">
						{true ? <BsPlayFill data-testid="play" /> : <BsPauseFill data-testid="pause" />}
					</button>
					<div className="audio-progress-bar">
						<div className="progress-bar-indicator"></div>
					</div>
					<audio src={message.content} data-testid="voice-note"></audio>
				</div>
			</div>
			<p className="voice-note-status">
				<span className="voice-note-duration">0:50</span>
				<span className="message-status-label">
					<BiCheckDouble
						className={!true ? "seen-status-color" : null}
						data-testid="message status"
					/>
				</span>
			</p>
		</div>
	);
}

function Messages(/* { messages } */) {
	return (
		<ul className="messages" aria-label="messages">
			{mockMessages.map((message, index) => {
				return (
					<li className="message" key={index} aria-label="message">
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
