import { useEffect } from "react";

import Messages from "../Messages/Messages";
import ChatControls from "../ChatControls/ChatControls";
import Backgrounds from "../Backgrounds/Backgrounds";
import Theme from "../Theme/Theme";

import socketClient from "../../socket-client";
import talk from "../../chat-icons/charla.png";
import "./ChatPanel.css";

function ChatPanel(props) {
	useEffect(() => {
		if (!props.user.id) socketClient.emit("new-user", props.user);
		socketClient.on("user-connected", (user) => {
			props.dispatch({
				type: "USER_CONNECTED",
				user,
			});
		});
	}, [props]);

	return (
		<section className="chat-panel">
			{props.settingOption === "no-render-options" ? (
				props.chatInfo
			) : (
				<div className="settings-components-container">
					{props.settingOption === "profile-settings" ? (
						props.profile
					) : props.settingOption === "background-settings" ? (
						<Backgrounds dispatch={props.dispatch} />
					) : props.settingOption === "theme-settings" ? (
						<Theme dispatch={props.dispatch} />
					) : null}
				</div>
			)}

			{!props.friend ? (
				<div className="no-chat">
					<div className="no-chat-container">
						<span>Talk to somebody</span>
						<img src={talk} alt="Start talk" loading="lazy" />
					</div>
				</div>
			) : (
				<div className="chat" data-testid="chat">
					<div className="friend-container">{props.friendComponent}</div>
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
