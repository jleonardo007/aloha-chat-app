import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../theme-context";

import { BiCheckDouble } from "react-icons/bi";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

function TextMessage({ message }) {
	const theme = useContext(ThemeContext);
	const [textMessageState, setTextMessageState] = useState({
		seenByFriend: false,
		hours: null,
		minutes: null,
	});

	const messageContentRef = useRef(null);

	useEffect(() => {
		const currentDate = Date.now();
		let currentHours = null;
		let currentMinutes = null;

		if (messageContentRef.current) messageContentRef.current.innerText = message.content;

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

			setTextMessageState((prevState) => {
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
		if (process.env.NODE_ENV === "test")
			testSocket.on("test:seen-messages", () => {
				setTextMessageState((prevState) => {
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
						setTextMessageState((prevState) => {
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
			socketClient.off("seen-message");
		};
	}, [message]);

	return (
		<div
			className={`${message.status === "send" ? "message-send" : "message-received"}`}
			style={{
				backgroundColor: message.status === "send" ? theme.bubbleSend : theme.bubbleReceived,
			}}
			data-testid="text-message-content"
		>
			<p className="text-message-content" ref={messageContentRef}></p>
			<p className="message-info-label">
				<span className="time-label">{message.time.hours}</span>:
				<span className="time-label">{message.time.minutes}</span>{" "}
				<span className="time-label">
					{message.time.hours >= 12 && message.time.hours <= 23 ? "PM" : "AM"}
				</span>
				{message.status === "send" && (
					<span className="message-status-label">
						<BiCheckDouble
							className={
								message.seenByFriend
									? "seen-status-color"
									: textMessageState.seenByFriend && "seen-status.color"
							}
							data-testid="message status"
						/>
					</span>
				)}
			</p>
		</div>
	);
}

export default TextMessage;
