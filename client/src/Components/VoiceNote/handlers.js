export function playVoiceNoteButton(setVoiceNoteState) {
  setVoiceNoteState((prevState) => {
    return { ...prevState, toggleButton: !prevState.toggleButton };
  });
}
