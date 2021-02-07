import { useReducer } from "react";

import CreateUser from "./Components/CreateUser/CreateUser";
import ChatPanel from "./Components/ChatPanel/ChatPanel";
import ChatInfo from "./Components/ChatInfo/ChatInfo";
import Friend from "./Components/Friend/Friend";
import Profile from "./Components/Profile/Profile";

const initialState = {
	userIsCreated: false,
	user: {},
	friend: null,
	settingOption: "no setting",
};

function reducer(state, action) {
	switch (action.type) {
		case "CREATE_USER":
			return {
				...state,
				userIsCreated: true,
				user: {
					name: action.userName,
					avatar: action.userAvatar,
				},
			};

		case "GET_FRIEND":
			return {
				...state,
				friend: action.user,
			};

		default:
			return state;
	}
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);

	return state.userIsCreated ? (
		<ChatPanel
			user={state.user}
			friend={state.friend}
			friendComponent={<Friend friend={state.friend} />}
			chatInfo={<ChatInfo user={state.user} dispatch={dispatch} />}
			profile={<Profile user={state.user} />}
		/>
	) : (
		<CreateUser dispatch={dispatch} />
	);
}

export default App;
