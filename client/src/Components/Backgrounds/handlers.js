export function changeBackground(e, setChatConfigObject) {
  setChatConfigObject((prevState) => {
    return {
      ...prevState,
      backgroundColor: e.target.getAttribute("data-color-value"),
      toggleBackgroundColor: "",
    };
  });
}

export function selectBackground(e, setChatConfigObject) {
  if (e.type === "mouseenter")
    setChatConfigObject((prevState) => {
      return {
        ...prevState,
        toggleBackgroundColor: e.target.getAttribute("data-color-value"),
      };
    });
  else if (e.type === "mouseleave")
    setChatConfigObject((prevState) => {
      return {
        ...prevState,
        toggleBackgroundColor: "",
      };
    });
  else
    setChatConfigObject((prevState) => {
      return {
        ...prevState,
      };
    });
}
