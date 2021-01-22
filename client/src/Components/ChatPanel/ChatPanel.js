import { useState, useEffect } from "react";
import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

import Menu from "../Menu/Menu";
import Messages from "../Messages/Messages";
import ChatControls from "../ChatControls/ChatControls";

import talk from "../../chat-icons/charla.png";
import noUsers from "../../chat-icons/no-active-users.png";
import "./ChatPanel.css";

function ActiveUsersList({ users, getReceptor }) {
	return (
		<div className="active-users-container">
			{users.map((user, index) => {
				return (
					<div
						className="user-info"
						data-testid="active-user"
						key={index}
						onClick={() => {
							getReceptor(user);
						}}
					>
						<img src={user.avatar} alt={user.name} className="user-avatar" />
						<div className="user-name">
							<span>{user.name}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function Receptor({ receptor }) {
	useEffect(() => {
		document.title = receptor.name;
	});

	return (
		<div className="receptor-container">
			<div className="user-info" data-testid="receptor">
				<img src={receptor.avatar} alt={receptor.name} className="user-avatar" />
				<div className="user-name">
					<span>{receptor.name}</span>
					<span className="action-label">Writing message...</span>
				</div>
				<div className="menu-container">
					<Menu>
						<ul className="menu">
							<li className="menu__item">Select messages</li>
							<li className="menu__item">Empty chat</li>
							<li className="menu__item">Enter to send</li>
						</ul>
					</Menu>
				</div>
			</div>
		</div>
	);
}

function ChatPanel({ user }) {
	const [activeUsers, setActiveUsers] = useState([]);
	const [chatReceptor, setReceptor] = useState(null);

	useEffect(() => {
		socketClient.emit("new-user", user);
	}, [user]);

	useEffect(() => {
		if (process.env.NODE_ENV === "test") {
			testSocket.on("test:active-users", (users) => {
				setActiveUsers(users);
			});
		} else
			socketClient.on("active-users", (users) => {
				setActiveUsers(users.filter((user) => user.id !== socketClient.id));
			});

		return () => {
			if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:active-users");
		};
	}, []);

	return (
		<section className="chat-panel">
			<div className="chat-info">
				<div className="user-container">
					<div className="user-info" data-testid="user-info">
						<img src={user.avatar} alt="User avatar" className="user-avatar" loading="lazy" />
						<div className="user-name">
							<span>{user.name}</span>
						</div>
						<div className="menu-container">
							<Menu>
								<ul className="menu">
									<li className="menu__item">Profile</li>
									<li className="menu__item">Change theme</li>
									<li className="menu__item">Change background</li>
								</ul>
							</Menu>
						</div>
					</div>
				</div>
				{activeUsers.length === 0 ? (
					<div className="no-active-users">
						<div className="no-active-users-container">
							<span>No active users</span>
							<img src={noUsers} alt="No users" loading="lazy" />
						</div>
					</div>
				) : (
					<ActiveUsersList users={activeUsers} getReceptor={setReceptor} />
				)}
			</div>

			{!chatReceptor ? (
				<div className="no-chat">
					<div className="no-chat-container">
						<span>Talk to somebody</span>
						<img src={talk} alt="Start talk" loading="lazy" />
					</div>
				</div>
			) : (
				<div className="chat" data-testid="chat">
					<Receptor receptor={chatReceptor} />
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
