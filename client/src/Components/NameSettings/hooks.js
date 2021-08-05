import { useState } from "react";
import { toggleEmojiPicker, selectUserName, addEmoji } from "./handlers";

export default function useNameSettings() {
  const [nameSettings, setNameSettings] = useState({
    newName: "",
    toggleEmojiPicker: false,
  });

  return {
    nameSettings,
    toggleEmojiPicker: () => toggleEmojiPicker(setNameSettings),
    selectUserName: (e) => selectUserName(e, setNameSettings),
    addEmoji: (e, emojiObject) => addEmoji(emojiObject, setNameSettings),
  };
}
