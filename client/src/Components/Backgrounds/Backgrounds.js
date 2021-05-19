import { useContext } from "react";
import { ThemeContext } from "../../theme-context";

import "./Backgrounds.css";

function Backgrounds({ dispatch, chatConfigObject, setChatConfigObject }) {
  const theme = useContext(ThemeContext);
  console.log(theme);
  function handleBackgroundChange(e) {
    setChatConfigObject({
      ...chatConfigObject,
      backgroundColor: e.target.getAttribute("data-color-value"),
      toggleBackgroundColor: "",
    });
  }

  function handleSelectBackground(e) {
    if (e.type === "mouseenter")
      setChatConfigObject({
        ...chatConfigObject,
        toggleBackgroundColor: e.target.getAttribute("data-color-value"),
      });
    else if (e.type === "mouseleave")
      setChatConfigObject({
        ...chatConfigObject,
        toggleBackgroundColor: "",
      });
    else
      setChatConfigObject({
        ...chatConfigObject,
      });
  }

  return (
    <div className="backgrounds-container" data-testid="backgrounds">
      {theme.backgroundColors.map((color, index) => {
        return (
          <div
            className="background"
            data-testid="color-options"
            style={{ backgroundColor: color }}
            data-color-value={color}
            key={index}
            onClick={(e) => handleBackgroundChange(e)}
            onMouseEnter={(e) => handleSelectBackground(e)}
            onMouseLeave={(e) => handleSelectBackground(e)}
          ></div>
        );
      })}
      <div className="back-btn-container">
        <button
          className="back-btn"
          onClick={() => dispatch({ type: "RENDER_CHAT_INFO" })}
          style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Backgrounds;
