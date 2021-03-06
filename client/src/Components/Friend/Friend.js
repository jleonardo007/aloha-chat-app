import { useState, useEffect } from "react";

import Menu from "../Menu/Menu";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";
import "./Friend.css";

function Friend({ friend, setChatConfigObject }) {
	const [friendAction, setFriendAction] = useState("");

	useEffect(() => {
		document.title = friend.name;
		if (process.env.NODE_ENV === "test")
			testSocket.on("test:friend-actions", (action) => {
				setFriendAction(action);
			});
		else
			socketClient.on("friend-actions", (actions) => {
				setFriendAction((prevState) => {
					if (prevState === actions) return prevState;
					else return actions;
				});
			});

		return () => {
			document.title = "";
			if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:friend-actions");
			else socketClient.off("friend-actions");
		};
	}, [friend]);

	useEffect(() => {
		let timeout = null;

		if (friendAction)
			timeout = setTimeout(() => {
				setFriendAction(() => "");
			}, 2000);

		return () => clearInterval(timeout);
	});

	function handleChatSettings(settingOption) {
		switch (settingOption) {
			case "select-messages":
				setChatConfigObject((prevState) => {
					return {
						...prevState,
						toggleMessageSelector: prevState.shouldToggleMessageSelector
							? !prevState.toggleMessageSelector
							: false,
					};
				});
				break;

			case "empty-chat":
				setChatConfigObject((prevState) => {
					return {
						...prevState,
						shouldEmptyChat: true,
					};
				});
				break;

			case "enter-to-send":
				setChatConfigObject((prevState) => {
					return {
						...prevState,
						shouldSetEnterToSend: true,
					};
				});
				break;

			default:
				break;
		}
	}

	return (
		<div className="user-info" data-testid="friend">
			<img src={friend.avatar} alt={friend.name} className="user-avatar" />
			<div className="user-name">
				<span>{friend.name}</span>
				<span className="action-label" data-testid="action-label">
					{friendAction}
				</span>
			</div>
			<div className="menu-container">
				<Menu>
					<ul className="menu" aria-label="chat settings">
						<li
							className="menu__item"
							aria-label="select messages"
							onClick={() => handleChatSettings("select-messages")}
						>
							Select messages
						</li>
						<li
							className="menu__item"
							aria-label="empty chat"
							onClick={() => handleChatSettings("empty-chat")}
						>
							Empty chat
						</li>
						<li
							className="menu__item"
							aria-label="enter to send"
							onClick={() => handleChatSettings("enter-to-send")}
						>
							Enter to send
						</li>
					</ul>
				</Menu>
			</div>
		</div>
	);
}

export default Friend;
