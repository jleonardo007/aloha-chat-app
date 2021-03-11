import { useState } from "react";

import TextBox from "./TextBox";
import VoiceNoteRecorder from "./VoiceNoteRecorder";
import { GrEmoji } from "react-icons/gr";
import { BsFillMicFill } from "react-icons/bs";
import { BiSend } from "react-icons/bi";

import socketClient from "../../socket-client";
import "./ChatControls.css";

function ChatControls({ friend, user, setSentMessage, chatConfigObject, setChatConfigObject }) {
	const [controls, setControls] = useState({
		toggleVoiceNoteButton: false,
		toggleVoiceNoteRecorder: false,
		toggleEmojiPicker: false,
		messageContent: null,
		messageContentType: "",
	});

	function handleEmojiPicker() {
		setControls((prevState) => {
			return {
				...prevState,
				toggleEmojiPicker: !prevState.toggleEmojiPicker,
			};
		});
	}

	function handleSentMessage(content) {
		let message = {};

		if (content) {
			message = {
				type: controls.messageContentType,
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
				content,
			};

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
					messageContent: null,
					messageContentType: "",
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

	return (
		<>
			<button className="emoji-btn" aria-label="emoji button" onClick={() => handleEmojiPicker()}>
				<GrEmoji />
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
					chatConfigObject={chatConfigObject}
					handleSentMessage={handleSentMessage}
				/>
			) : (
				<>
					{controls.toggleVoiceNoteButton ? (
						<button
							className="voice-note-btn"
							aria-label="send message button"
							onClick={() => handleSentMessage(controls.messageContent)}
						>
							<BiSend />
						</button>
					) : (
						<button
							className="voice-note-btn"
							aria-label="voice note button"
							onClick={() =>
								setControls((prevState) => {
									return {
										...prevState,
										toggleVoiceNoteRecorder: !prevState.toggleVoiceNoteRecorder,
									};
								})
							}
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
