import { useState, useEffect, useRef } from "react";

import { BiCheckDouble } from "react-icons/bi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

function VoiceNote({ message }) {
	const voiceNoteRef = useRef(null);
	const [voiceNoteState, setVoiceNoteState] = useState({
		toggleButton: false,
		seenByFriend: false,
		hours: null,
		minutes: null,
	});

	useEffect(() => {
		const currentDate = Date.now();
		let currentHours = null;
		let currentMinutes = null;

		if (!message.time.hours && !message.time.minutes) {
			currentHours = `${
				new Date(currentDate).getHours() >= 10
					? new Date(currentDate).getHours()
					: `0${new Date(currentDate).getHours()}`
			}`;
			currentMinutes = `${
				new Date(currentDate).getMinutes() >= 10
					? new Date(currentDate).getMinutes()
					: `0${new Date(currentDate).getMinutes()}`
			}`;

			setVoiceNoteState((prevState) => {
				message.time.hours = currentHours;
				message.time.minutes = currentMinutes;

				return {
					...prevState,
					hours: currentHours,
					minutes: currentMinutes,
				};
			});
		}
	}, [message]);

	useEffect(() => {
		if (voiceNoteRef.current) {
			if (voiceNoteState.toggleButton) voiceNoteRef.current.play();
			else voiceNoteRef.current.pause();
		}
	}, [voiceNoteState.toggleButton]);

	useEffect(() => {
		if (process.env.NODE_ENV === "test")
			testSocket.on("test:seen-messages", () => {
				setVoiceNoteState((prevState) => {
					message.seenByFriend = true;
					return {
						...prevState,
						seenByFriend: true,
					};
				});
			});

		switch (message.status) {
			case "send":
				if (!message.seenByFriend)
					socketClient.on("seen-message", () => {
						setVoiceNoteState((prevState) => {
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

	useEffect(() => {
		if (voiceNoteRef.current) {
			voiceNoteRef.current.addEventListener("ended", () =>
				setVoiceNoteState((prevState) => {
					return {
						...prevState,
						toggleButton: false,
					};
				})
			);
		}
	}, []);

	function handlePlayVoiceNoteButton() {
		setVoiceNoteState((prevState) => {
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
				<img src={message.from.avatar} alt={message.from.name} className="user-avatar" />
				<div className="voice-note">
					{!voiceNoteState.toggleButton ? (
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
					<audio ref={voiceNoteRef} src={message.content} data-testid="voice-note"></audio>
				</div>
			</div>
			<p className="voice-note-status">
				<span className="voice-note-duration">
					{voiceNoteRef.current && voiceNoteRef.current.currentTime}
				</span>
				<span className="time-label">{message.time.hours}</span>:
				<span className="time-label">{message.time.minutes}</span>{" "}
				<span className="time-label">
					{message.time.hours >= 12 && message.time.hours <= 23 ? " PM" : " AM"}
				</span>
				{message.status === "send" && (
					<span className="message-status-label">
						<BiCheckDouble
							className={
								message.seenByFriend
									? "seen-status-color"
									: voiceNoteState.seenByFriend && "seen-status.color"
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
