import { useState } from "react";

import CreateUser from "./Components/CreateUser/CreateUser";
import ChatPanel from "./Components/ChatPanel/ChatPanel";
import ChatInfo from "./Components/ChatInfo/ChatInfo";
import Friend from "./Components/Friend/Friend";
import Profile from "./Components/Profile/Profile";

function App() {
	const [userIsCreated, setUserIsCreated] = useState(false);
	const [user, setUser] = useState({});
	const [friend, setFriend] = useState(null);

	const joinChat = (name, avatar) => {
		setUser({
			name,
			avatar,
		});

		setUserIsCreated(!userIsCreated);
	};

	return userIsCreated ? (
		<ChatPanel
			user={user}
			friend={friend}
			friendComponent={<Friend friend={friend} />}
			chatInfo={<ChatInfo user={user} setFriend={setFriend} />}
			profile={<Profile user={user} />}
		/>
	) : (
		<CreateUser joinChat={joinChat} />
	);
}

export default App;
