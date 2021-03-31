import { useState } from "react";

import TextBox from "./TextBox";
import VoiceNoteRecorder from "./VoiceNoteRecorder";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { BsFillMicFill } from "react-icons/bs";
import { BiSend } from "react-icons/bi";

import socketClient from "../../socket-client";
import "./ChatControls.css";

function ChatControls({ friend, user, setSentMessage, chatConfigObject, setChatConfigObject }) {
	const [controls, setControls] = useState({
		toggleVoiceNoteButton: false,
		toggleVoiceNoteRecorder: false,
		toggleEmojiPicker: false,
		mediaStream: null,
		textContent: "", // TextBox compontent state will be copied to it to use in handleSentMessage when send button clicks
	});

	function handleEmojiPicker() {
		setControls((prevState) => {
			return {
				...prevState,
				toggleEmojiPicker: !prevState.toggleEmojiPicker,
			};
		});
	}

	function handleSentMessage(messageObject) {
		let message = {};

		if (messageObject) {
			if (messageObject.type === "text")
				message = {
					type: messageObject.type,
					content: messageObject.content,
					status: "send",
					isStored: false,
					shouldDelete: false,
					seenByFriend: false,
					from: { ...user },
					to: { ...friend },
					time: {
						hours: "",
						minutes: "",
					},
				};
			else if (messageObject.type === "voice-note")
				message = {
					type: messageObject.type,
					content: messageObject.content,
					status: "send",
					isStored: false,
					shouldDelete: false,
					seenByFriend: false,
					from: { ...user },
					to: { ...friend },
					time: {
						hours: "",
						minutes: "",
					},
					duration: {
						minutes: messageObject.minutes,
						seconds: messageObject.seconds,
					},
				};
			else return;

			socketClient.emit("sent-message", { friend, message });
			setSentMessage((prevState) => {
				return {
					...prevState,
					sentMessage: message,
				};
			});

			setControls((prevState) => {
				return {
					...prevState,
					toggleVoiceNoteButton: false,
				};
			});
		}
	}

	function handleSelectedMessagesDeletion() {
		setChatConfigObject((prevState) => {
			return {
				...prevState,
				toggleMessageSelector: false,
				shouldToggleMessageSelector: false,
				shouldDeleteSelectedMessages: true,
				selectedMessagesCounter: 0,
			};
		});
	}

	async function handleUserMediaRequest() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			setControls((prevState) => {
				return {
					...prevState,
					toggleVoiceNoteRecorder: !prevState.toggleVoiceNoteRecorder,
					mediaStream: stream,
				};
			});
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<button className="emoji-btn" aria-label="emoji button" onClick={() => handleEmojiPicker()}>
				<HiOutlineEmojiHappy />
			</button>
			<TextBox
				user={user}
				friend={friend}
				controls={controls}
				chatConfigObject={chatConfigObject}
				setControls={setControls}
				handleSentMessage={handleSentMessage}
				handleSelectedMessagesDeletion={handleSelectedMessagesDeletion}
			/>
			{controls.toggleVoiceNoteRecorder ? (
				<VoiceNoteRecorder
					user={user}
					friend={friend}
					controls={controls}
					setControls={setControls}
					handleSentMessage={handleSentMessage}
				/>
			) : (
				<>
					{controls.toggleVoiceNoteButton ? (
						<button
							className="voice-note-btn"
							aria-label="send message button"
							onClick={() => handleSentMessage({ content: controls.textContent, type: "text" })}
						>
							<BiSend />
						</button>
					) : (
						<button
							className="voice-note-btn"
							aria-label="voice note button"
							onClick={() => handleUserMediaRequest()}
						>
							<BsFillMicFill />
						</button>
					)}
				</>
			)}
		</>
	);
}

export default ChatControls;
