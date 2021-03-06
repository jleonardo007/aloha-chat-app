import { useState, useEffect } from "react";

import { BiCheckDouble } from "react-icons/bi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";
import { mockMessages } from "../../test_utils/mockData";
import messagesBackground from "../../chat-icons/messages_bg.png";
import "./Messages.css";

function TextMessages({ status, content }) {
	const [seenByFriend, setSeenByFriend] = useState(false);

	useEffect(() => {
		if (process.env.NODE_ENV === "test")
			testSocket.on("test:seen-messages", () => {
				setSeenByFriend(true);
			});
		else
			socketClient.on("seen-messages", () => {
				setSeenByFriend(true);
			});

		return () => {
			if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:seen-messages");
			socketClient.off("seen-messages");
		};
	});

	return (
		<p
			className={`${status === "send" ? "message-send" : "message-received"}`}
			data-testid="text-message-content"
		>
			{content}
			<span className="message-status-label">
				<BiCheckDouble
					className={seenByFriend ? "seen-status-color" : null}
					data-testid="message status"
				/>
			</span>
		</p>
	);
}

function VoiceNote({ user, message }) {
	const [voiceNoteObject, setVoiceNoteObject] = useState({
		toggleButton: false,
		seenByFriend: false,
	});

	useEffect(() => {
		if (process.env.NODE_ENV === "test")
			testSocket.on("test:seen-messages", () => {
				setVoiceNoteObject((prevState) => {
					return {
						...prevState,
						seenByFriend: true,
					};
				});
			});
		else
			socketClient.on("seen-messages", () => {
				setVoiceNoteObject((prevState) => {
					return {
						...prevState,
						seenByFriend: true,
					};
				});
			});

		return () => {
			if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:seen-messages");
			socketClient.off("seen-messages");
		};
	});

	function handleVoiceNoteButton() {
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
				<img src={user.avatar} alt={user.name} className="user-avatar" />
				<div className="voice-note">
					{!voiceNoteObject.toggleButton ? (
						<button
							className="play-voice-note-btn"
							aria-label="play voice note"
							onClick={() => handleVoiceNoteButton()}
						>
							<BsPlayFill />
						</button>
					) : (
						<button
							className="play-voice-note-btn"
							aria-label="pause voice note"
							onClick={() => handleVoiceNoteButton()}
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
				<span className="message-status-label">
					<BiCheckDouble
						className={voiceNoteObject.seenByFriend ? "seen-status-color" : null}
						data-testid="message status"
					/>
				</span>
			</p>
		</div>
	);
}

function Messages({
	userId,
	friendId,
	sentMessage,
	receivedMessage,
	chatConfigObject,
	setChatConfigObject,
}) {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (process.env.NODE_ENV === "test") setMessages(mockMessages);

		socketClient.emit("get:conversation", { userId, friendId });
		socketClient.on("get:conversation", (messages) => {
			if (Array.isArray(receivedMessage)) setMessages([...messages, ...receivedMessage]);
			else if (receivedMessage) setMessages([...messages, receivedMessage]);
			else setMessages(messages);
		});

		return () => {
			setMessages((prevState) => {
				const notStoredMessages = prevState.filter((message) => !message.isStored);

				if (notStoredMessages.length > 0)
					socketClient.emit("save-conversation", {
						userId,
						friendId,
						messages: [...notStoredMessages],
						hasDeletedMessages: false,
					});

				return [];
			});

			socketClient.off("get:conversation");
		};
	}, [friendId, userId, receivedMessage]);

	useEffect(() => {
		if (sentMessage) setMessages((prevState) => [...prevState, sentMessage]);
	}, [sentMessage]);

	useEffect(() => {
		if (Array.isArray(receivedMessage))
			setMessages((prevState) => [...prevState, ...receivedMessage]);
		else if (receivedMessage) setMessages((prevState) => [...prevState, receivedMessage]);
	}, [receivedMessage]);

	// eslint-disable-next-line
	useEffect(() => {
		if (messages.length > 0)
			setChatConfigObject((prevState) => {
				if (!prevState.shouldToggleMessageSelector)
					return {
						...prevState,
						shouldToggleMessageSelector: true,
					};
				else return prevState;
			});

		if (chatConfigObject.shouldEmptyChat) {
			setMessages(() => []);

			setChatConfigObject((prevState) => {
				return {
					...prevState,
					shouldToggleMessageSelector: false,
					shouldEmptyChat: false,
				};
			});

			socketClient.emit("save-conversation", {
				userId,
				friendId,
				messages: [],
				hasDeletedMessages: true,
			});
		}

		if (chatConfigObject.shouldDeleteSelectedMessages) {
			setMessages((prevState) => prevState.filter((message) => !message.shouldDelete));

			setChatConfigObject((prevState) => {
				return {
					...prevState,
					shouldDeleteSelectedMessages: false,
				};
			});

			socketClient.emit("save-conversation", {
				userId,
				friendId,
				messages: [...messages.filter((message) => !message.shouldDelete)],
				hasDeletedMessages: true,
			});
		}
	});

	return (
		<ul
			className="messages"
			aria-label="messages"
			style={{
				backgroundImage: `url(${messagesBackground})`,
				backgroundColor: chatConfigObject.toggleBackgroundColor
					? chatConfigObject.toggleBackgroundColor
					: chatConfigObject.toggleBackgroundColor
					? chatConfigObject.toggleBackgroundColor
					: chatConfigObject.backgroundColor,
			}}
		>
			{messages.map((message, index) => (
				<li className="message" key={index} aria-label="message">
					{chatConfigObject.toggleMessageSelector && (
						<input
							type="checkbox"
							className="select-box"
							onClick={(e) => {
								setChatConfigObject((prevState) => {
									return {
										...prevState,
										selectedMessagesCounter: e.target.checked
											? prevState.selectedMessagesCounter + 1
											: prevState.selectedMessagesCounter - 1,
									};
								});
								message.shouldDelete = e.target.checked ? true : false;
							}}
						/>
					)}

					{message.type === "text" ? (
						<TextMessages status={message.status} content={message.content} />
					) : message.type === "voice-note" ? (
						<VoiceNote user={message.user} message={message} />
					) : (
						<p> Invalid message content. </p>
					)}
				</li>
			))}
		</ul>
	);
}

export default Messages;
