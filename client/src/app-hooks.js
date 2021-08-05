import { useState, useEffect, useReducer } from "react";
import { themes } from "./theme-context";
import reducer from "./app-reducer";

const initialState = {
  userIsCreated: false,
  user: {},
  friend: null,
  settingOptionToRender: "no-render-options",
  theme: themes.light,
};

export default function useChatApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [chatConfigObject, setChatConfigObject] = useState({
    toggleMessageSelector: false,
    shouldToggleMessageSelector: false,
    shouldEmptyChat: false,
    shouldDeleteSelectedMessages: false,
    shouldSetEnterToSend: false,
    selectedMessagesCounter: 0,
    backgroundColor: state.theme.primaryColor,
    toggleBackgroundColor: "",
  });

  useEffect(() => {
    setChatConfigObject((prevState) => {
      return {
        ...prevState,
        backgroundColor: state.theme.primaryColor,
      };
    });
  }, [state.theme.primaryColor]);

  return {
    state,
    chatConfigObject,
    dispatch,
    setChatConfigObject,
  };
}
