import { useState, useEffect } from "react";

import { BiCheckDouble } from "react-icons/bi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

function VoiceNote({ message }) {
	const [voiceNoteObject, setVoiceNoteObject] = useState({
		toggleButton: false,
		seenByFriend: false,
	});

	useEffect(() => {
		if (process.env.NODE_ENV === "test")
			testSocket.on("test:seen-messages", () => {
				setVoiceNoteObject((prevState) => {
					message.seenByFriend = true;
					return {
						...prevState,
						seenByFriend: true,
					};
				});
			});

		switch (message.status) {
			case "send":
				if (!message.seenByFriend) console.log("lalala");
				socketClient.on("seen-message", () => {
					setVoiceNoteObject((prevState) => {
						message.seenByFriend = true;
						return {
							...prevState,
							seenByFriend: true,
						};
					});
				});
				break;

			case "received":
				socketClient.emit("seen-message", message.from);
				break;

			default:
		}

		return () => {
			if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:seen-messages");
			socketClient.off("seen-messages");
		};
	});

	function handlePlayVoiceNoteButton() {
		setVoiceNoteObject((prevState) => {
			return { ...prevState, toggleButton: !prevState.toggleButton };
		});
	}

	return (
		<div
			className={`voice-note-container ${
				message.status === "send" ? "message-send" : "message-received"
			}`}
		>
			<div className={`${message.status === "send" ? "voice-note-send " : "voice-note-received "}`}>
				<img src={message.user.avatar} alt={message.user.name} className="user-avatar" />
				<div className="voice-note">
					{!voiceNoteObject.toggleButton ? (
						<button
							className="play-voice-note-btn"
							aria-label="play voice note"
							onClick={() => handlePlayVoiceNoteButton()}
						>
							<BsPlayFill />
						</button>
					) : (
						<button
							className="play-voice-note-btn"
							aria-label="pause voice note"
							onClick={() => handlePlayVoiceNoteButton()}
						>
							<BsPauseFill />
						</button>
					)}

					<div className="audio-progress-bar">
						<div className="progress-bar-indicator"></div>
					</div>
					<audio src={message.content} data-testid="voice-note"></audio>
				</div>
			</div>
			<p className="voice-note-status">
				<span className="voice-note-duration">0:50</span>
				{message.status === "send" && (
					<span className="message-status-label">
						<BiCheckDouble
							className={
								message.seenByFriend
									? "seen-status-color"
									: voiceNoteObject.seenByFriend && "seen-status.color"
							}
							data-testid="message status"
						/>
					</span>
				)}
			</p>
		</div>
	);
}

export default VoiceNote;
