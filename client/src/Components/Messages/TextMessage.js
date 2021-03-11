import { useState, useEffect } from "react";

import { BiCheckDouble } from "react-icons/bi";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

function TextMessage({ message }) {
	const [seenByFriend, setSeenByFriend] = useState(false);

	useEffect(() => {
		if (process.env.NODE_ENV === "test")
			testSocket.on("test:seen-messages", () => {
				setSeenByFriend(() => {
					message.seenByFriend = true;
					return true;
				});
			});

		switch (message.status) {
			case "send":
				if (!message.seenByFriend) console.log("lalala");
				socketClient.on("seen-message", () => {
					setSeenByFriend(() => {
						message.seenByFriend = true;
						return true;
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
		<p
			className={`${message.status === "send" ? "message-send" : "message-received"}`}
			data-testid="text-message-content"
		>
			{message.content}
			{message.status === "send" && (
				<span className="message-status-label">
					<BiCheckDouble
						className={
							message.seenByFriend ? "seen-status-color" : seenByFriend && "seen-status.color"
						}
						data-testid="message status"
					/>
				</span>
			)}
		</p>
	);
}

export default TextMessage;
