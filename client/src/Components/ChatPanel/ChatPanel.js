import { useState, useEffect } from "react";
import socketClient from "../../socket-client";

import ChatInfo from "../ChatInfo/ChatInfo";
import Friend from "../Friend/Friend";
import Messages from "../Messages/Messages";
import ChatControls from "../ChatControls/ChatControls";
import Profile from "../Profile/Profile";
import Backgrounds from "../Backgrounds/Backgrounds";
import Theme from "../Theme/Theme";

import talk from "../../chat-icons/charla.png";
import "./ChatPanel.css";

function ChatPanel({ user }) {
	const [friend, setFriend] = useState(null);

	useEffect(() => {
		socketClient.emit("new-user", user);
	});

	return (
		<section className="chat-panel">
			{true ? (
				<ChatInfo user={user} setFriend={setFriend} />
			) : (
				<div className="settings-components-container">
					{!true ? <Profile user={user} /> : !true ? <Backgrounds /> : <Theme />}
				</div>
			)}

			{!friend ? (
				<div className="no-chat">
					<div className="no-chat-container">
						<span>Talk to somebody</span>
						<img src={talk} alt="Start talk" loading="lazy" />
					</div>
				</div>
			) : (
				<div className="chat" data-testid="chat">
					<div className="friend-container">
						<Friend friend={friend} />
					</div>
					<div className="messages-container">
						<Messages />
					</div>
					<div className="chat-controls-container">
						<ChatControls />
					</div>
				</div>
			)}
		</section>
	);
}

export default ChatPanel;
