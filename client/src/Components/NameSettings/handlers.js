export function toggleEmojiPicker(setNameSettings) {
  setNameSettings((prevState) => {
    return {
      ...prevState,
      toggleEmojiPicker: !prevState.toggleEmojiPicker,
    };
  });
}

export function selectUserName(e, setNameSettings) {
  setNameSettings((prevState) => {
    return {
      ...prevState,
      newName: e.target.value,
    };
  });
}

export function addEmoji(emojiObject, setNameSettings) {
  setNameSettings((prevState) => {
    return {
      ...prevState,
      newName: `${prevState.newName}${emojiObject.emoji}`,
    };
  });
}
