import { useState, useEffect, useRef } from "react";

import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { BsFillMicFill } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";

import socketClient from "../../socket-client";
import "./ChatControls.css";

const emojiPickerStyle = {
	width: "65%",
	position: "absolute",
	bottom: "12%",
	zIndex: "1",
	boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.4)",
};

function ChatControls({ friend, user, setSentMessage, chatConfigObject, setChatConfigObject }) {
	const [controls, setControls] = useState({
		toggleTextInput: false,
		toggleVoiceNoteButton: false,
		toggleEmojiButton: false,
		toggleEmojiPicker: false,
		toggleCancelVoiceNoteDialog: false,
		messageContent: null,
	});
	const messageInputRef = useRef(null);

	useEffect(() => {
		if (chatConfigObject.selectedMessagesCounter > 0)
			setControls((prevState) => {
				return {
					...prevState,
					toggleTextInput: true,
					toggleCancelVoiceNoteDialog: true,
				};
			});
		else if (chatConfigObject.selectedMessagesCounter === 0)
			setControls((prevState) => {
				return {
					...prevState,
					toggleTextInput: false,
					toggleCancelVoiceNoteDialog: false,
				};
			});
		return () => {};
	}, [chatConfigObject.selectedMessagesCounter]);

	function handleEmojiPicker() {
		setControls((prevState) => {
			return {
				...prevState,
				toggleEmojiPicker: !prevState.toggleEmojiPicker,
			};
		});
	}

	function handleTextMessage(e) {
		socketClient.emit("friend-actions", { friend, action: "Writing a message..." });
		setControls((prevState) => {
			return {
				...prevState,
				toggleVoiceNoteButton: e.target.innerText ? true : false,
				messageContent: e.target.innerText,
			};
		});
	}

	function handleVoiceNoteRecording(e) {
		if (e.type === "mousedown") {
			socketClient.emit("friend-actions", { friend, action: "Recording an voice note..." });
			setControls((prevState) => {
				return {
					...prevState,
					toggleEmojiButton: !prevState.toggleEmojiButton,
					toggleTextInput: !prevState.toggleTextInput,
				};
			});
		} else if (e.type === "mouseup")
			setControls((prevState) => {
				return {
					...prevState,
					toggleEmojiButton: !prevState.toggleEmojiButton,
					toggleTextInput: !prevState.toggleTextInput,
				};
			});
		else
			setControls((prevState) => {
				return { ...prevState };
			});
	}

	function handleSentMessage(content) {
		let message = {};

		if (content) {
			message = {
				type: "text",
				status: "send",
				isStored: false,
				shouldDelete: false,
				from: { ...user },
				to: { ...friend },
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
					toggleVoiceNoteButton: !prevState.toggleVoiceNoteButton,
					messageContent: null,
				};
			});
			messageInputRef.current.innerText = "";
		}
	}

	return (
		<>
			{!controls.toggleEmojiButton ? (
				<button className="emoji-btn" aria-label="emoji button" onClick={() => handleEmojiPicker()}>
					<GrEmoji />
				</button>
			) : (
				<BsFillMicFill className="animated-mic" data-testid="animated-mic" />
			)}
			<div className="messages-input-container">
				{!controls.toggleTextInput ? (
					<span
						className="message-input"
						role="textbox"
						aria-label="message input"
						contentEditable
						autoFocus
						innertext={controls.textMessage}
						ref={messageInputRef}
						onInput={(e) => handleTextMessage(e)}
					></span>
				) : !controls.toggleCancelVoiceNoteDialog ? (
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
							<span data-testid="selected-messages-counter">
								{chatConfigObject.selectedMessagesCounter}
							</span>{" "}
							messages selected
						</p>
						<button
							className="delete-messages-btn"
							aria-label="delete messages button"
							onClick={() =>
								setChatConfigObject((prevState) => {
									return {
										...prevState,
										toggleMessageSelector: false,
										shouldToggleMessageSelector: false,
										shouldDeleteSelectedMessages: true,
										selectedMessagesCounter: 0,
									};
								})
							}
						>
							<BsTrash />
						</button>
					</div>
				)}
			</div>
			{!controls.toggleVoiceNoteButton ? (
				<button
					className="voice-note-btn"
					draggable
					aria-label="voice note button"
					onMouseDown={(e) => handleVoiceNoteRecording(e)}
					onMouseUp={(e) => handleVoiceNoteRecording(e)}
				>
					<BsFillMicFill />
				</button>
			) : (
				<button
					className="voice-note-btn"
					aria-label="send message button"
					onClick={() => handleSentMessage(controls.messageContent)}
				>
					<BiSend />
				</button>
			)}

			{controls.toggleEmojiPicker && (
				<Picker
					pickerStyle={emojiPickerStyle}
					disableAutoFocus={true}
					disableSearchBar={true}
					data-testid="emoji-picker"
				/>
			)}
		</>
	);
}

export default ChatControls;
