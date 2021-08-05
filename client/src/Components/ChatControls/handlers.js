import socketClient from "../../socket-client";

export function toggleEmojiPicker(setControls) {
  setControls((prevState) => {
    return {
      ...prevState,
      toggleEmojiPicker: !prevState.toggleEmojiPicker,
    };
  });
}

export function deleteSelectedMessages(setChatConfigObject) {
  setChatConfigObject((prevState) => {
    return {
      ...prevState,
      toggleMessageSelector: false,
      shouldToggleMessageSelector: false,
      shouldDeleteSelectedMessages: true,
      selectedMessagesCounter: 0,
    };
  });
}

export async function requestUserMedia(setControls) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    setControls((prevState) => {
      return {
        ...prevState,
        toggleVoiceNoteRecorder: !prevState.toggleVoiceNoteRecorder,
        mediaStream: stream,
      };
    });
  } catch (err) {
    console.log(err);
  }
}

export function closeRecorder(recordingState, setControls) {
  if (recordingState.minutes === 4 && recordingState.seconds === 59)
    alert("Has reached max recording time");

  setControls((prevState) => {
    return {
      ...prevState,
      toggleVoiceNoteRecorder: !prevState.toggleVoiceNoteRecorder,
      mediaStream: null,
    };
  });
}

export function sendMessage(messageObject, user, friend, setChatMessagesObject, setControls) {
  let message = {};

  if (messageObject) {
    if (messageObject.type === "text")
      message = {
        type: messageObject.type,
        content: messageObject.content,
        status: "send",
        isStored: false,
        shouldDelete: false,
        seenByFriend: false,
        from: { ...user },
        to: { ...friend },
        time: {
          hours: "",
          minutes: "",
        },
      };
    else if (messageObject.type === "voice-note")
      message = {
        type: messageObject.type,
        content: messageObject.content,
        status: "send",
        isStored: false,
        shouldDelete: false,
        seenByFriend: false,
        from: { ...user },
        to: { ...friend },
        time: {
          hours: "",
          minutes: "",
        },
        duration: {
          minutes: messageObject.minutes,
          seconds: messageObject.seconds,
        },
      };
    else return;

    socketClient.emit("sent-message", { friend, message });
    setChatMessagesObject((prevState) => {
      return {
        ...prevState,
        sentMessage: message,
      };
    });

    setControls((prevState) => {
      return {
        ...prevState,
        toggleVoiceNoteButton: false,
      };
    });
  }
}

export function createTextMessage(
  e,
  emojiObject,
  textBoxState,
  setTextBoxState,
  user,
  friend,
  chatConfigObject,
  sendMessage,
  setControls
) {
  socketClient.emit("friend-actions", { user, friend, action: "Writing a message..." });

  switch (e.type) {
    case "click":
      setControls((prevState) => {
        return {
          ...prevState,
          textContent: `${prevState.textContent || ""}${emojiObject.emoji}`,
          toggleVoiceNoteButton: true,
        };
      });

      setTextBoxState((prevState) => {
        return {
          ...prevState,
          content: `${prevState.content || ""}${emojiObject.emoji}`,
        };
      });
      break;

    case "input":
      if (
        e.target.innerText.trim() &&
        e.target.innerText.includes("\n") &&
        chatConfigObject.shouldSetEnterToSend
      ) {
        sendMessage(textBoxState);
        setTextBoxState((prevState) => {
          return {
            ...prevState,
            content: "",
          };
        });
      } else {
        setControls((prevState) => {
          return {
            ...prevState,
            textContent: e.target.innerText.trimStart(),
            toggleVoiceNoteButton: e.target.innerText.trimStart() ? true : false,
          };
        });

        setTextBoxState((prevState) => {
          return {
            ...prevState,
            content: e.target.innerText.trimStart(),
          };
        });
      }
      break;
    default:
  }
}
