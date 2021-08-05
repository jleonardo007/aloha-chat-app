import { useState, useEffect, useRef } from "react";
import { setTextBoxFocus } from "./handlers";

export default function useTextBox(controls, chatConfigObject) {
  const messageInputRef = useRef(null);
  const selectedMessagesCounterRef = useRef(null);
  const [textBoxState, setTextBoxState] = useState({
    content: "",
    type: "text",
  });

  useEffect(() => {
    if (!chatConfigObject.toggleMessageSelector) {
      messageInputRef.current.focus();

      if (textBoxState.content) {
        const range = document.createRange();
        const selection = window.getSelection();

        messageInputRef.current.innerText = textBoxState.content;
        range.selectNodeContents(messageInputRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else messageInputRef.current.innerText = "";
    } else if (selectedMessagesCounterRef.current.firstChild.nodeName === "#text")
      selectedMessagesCounterRef.current.removeChild(selectedMessagesCounterRef.current.firstChild);
  });

  useEffect(() => {
    if (!controls.toggleVoiceNoteButton) {
      setTextBoxState((prevState) => {
        return {
          ...prevState,
          content: "",
        };
      });
      messageInputRef.current.innerText = "";
    }
  }, [controls.toggleVoiceNoteButton]);

  return {
    textBoxState,
    messageInputRef,
    selectedMessagesCounterRef,
    setTextBoxState,
    setTextBoxFocus: () => setTextBoxFocus(messageInputRef),
  };
}
