import { useState, useEffect } from "react";

import { BiCheckDouble } from "react-icons/bi";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

function TextMessage({ message }) {
	const [textMessageState, setTextMessageState] = useState({
		seenByFriend: false,
		hours: null,
		minutes: null,
	});

	useEffect(() => {
		const currentDate = Date.now();
		let currentHours = null;
		let currentMinutes = null;

		if (!message.time.hour && !message.time.minute) {
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
				if (!message.seenByFriend) console.log("lalala");
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
			data-testid="text-message-content"
		>
			<p className="text-message-content">{message.content}</p>
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
