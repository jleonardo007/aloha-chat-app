export function setchatConfig(settingOption, setChatConfigObject) {
  switch (settingOption) {
    case "select-messages":
      setChatConfigObject((prevState) => {
        return {
          ...prevState,
          selectedMessagesCounter: 0,
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
          shouldEmptyChat: prevState.toggleMessageSelector ? false : true,
        };
      });
      break;

    case "enter-to-send":
      setChatConfigObject((prevState) => {
        return {
          ...prevState,
          shouldSetEnterToSend: !prevState.shouldSetEnterToSend,
        };
      });
      break;

    default:
      break;
  }
}
