import { ThemeContext } from "./theme-context";
import ChatPanel from "./Components/ChatPanel";
import CreateUser from "./Components/CreateUser";
import ChatInfo from "./Components/ChatInfo";
import Friend from "./Components/Friend";
import Profile from "./Components/Profile";
import useChatApp from "./app-hooks";

export default function App() {
  const { state, chatConfigObject, dispatch, setChatConfigObject } = useChatApp();

  return state.userIsCreated ? (
    <ThemeContext.Provider value={state.theme}>
      <ChatPanel
        user={state.user}
        friend={state.friend}
        settingOption={state.settingOptionToRender}
        dispatch={dispatch}
        chatConfigObject={chatConfigObject}
        setChatConfigObject={setChatConfigObject}
        Friend={<Friend friend={state.friend} setChatConfigObject={setChatConfigObject} />}
        ChatInfo={<ChatInfo user={state.user} currentFriend={state.friend} dispatch={dispatch} />}
        Profile={<Profile user={state.user} dispatch={dispatch} />}
      />
    </ThemeContext.Provider>
  ) : (
    <CreateUser dispatch={dispatch} />
  );
}
