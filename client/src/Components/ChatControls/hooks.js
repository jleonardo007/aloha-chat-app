import { useState } from "react";
import {
  toggleEmojiPicker,
  sendMessage,
  deleteSelectedMessages,
  createTextMessage,
  requestUserMedia,
  closeRecorder,
} from "./handlers";

export default function useChatControls(
  friend,
  user,
  chatConfigObject,
  setChatConfigObject,
  setChatMessagesObject
) {
  const [controls, setControls] = useState({
    toggleVoiceNoteButton: false,
    toggleVoiceNoteRecorder: false,
    toggleEmojiPicker: false,
    mediaStream: null,
    textContent: "", // TextBox compontent state will be copied to it to use in handleSentMessage when send button clicks
  });

  return {
    controls,
    toggleEmojiPicker: () => toggleEmojiPicker(setControls),
    requestUserMedia: () => requestUserMedia(setControls),
    closeRecorder: (recordingState) => closeRecorder(recordingState, setControls),
    deleteSelectedMessages: () => deleteSelectedMessages(setChatConfigObject),
    sendMessage: (messageObject) =>
      sendMessage(messageObject, user, friend, setChatMessagesObject, setControls),
    createTextMessage: (e, emojiObject, textBoxState, sendMessage, setTextBoxState) =>
      createTextMessage(
        e,
        emojiObject,
        textBoxState,
        setTextBoxState,
        user,
        friend,
        chatConfigObject,
        sendMessage,
        setControls
      ),
  };
}
