import { useState, useEffect } from "react";

import { BiCheckDouble } from "react-icons/bi";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

function TextMessage({ status, content }) {
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

export default TextMessage;
