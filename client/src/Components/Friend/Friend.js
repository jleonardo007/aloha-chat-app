import { useEffect } from "react";

import Menu from "../Menu/Menu";
import "./Friend.css";

function Friend({ friend }) {
	useEffect(() => {
		document.title = friend.name;
	});

	return (
		<div className="user-info" data-testid="friend">
			<img src={friend.avatar} alt={friend.name} className="user-avatar" />
			<div className="user-name">
				<span>{friend.name}</span>
				<span className="action-label" data-testid="action-label">
					Writing a message...
				</span>
			</div>
			<div className="menu-container">
				<Menu>
					<ul className="menu" aria-label="chat settings">
						<li className="menu__item" aria-label="select messages">
							Select messages
						</li>
						<li className="menu__item" aria-label="empty chat">
							Empty chat
						</li>
						<li className="menu__item" aria-label="enter to send">
							Enter to send
						</li>
					</ul>
				</Menu>
			</div>
		</div>
	);
}

export default Friend;
