import { useContext } from "react";
import { ThemeContext } from "../../theme-context";
import { changeBackground, selectBackground } from "./handlers";
import "./styles.css";

export default function Backgrounds({ dispatch, setChatConfigObject }) {
  const theme = useContext(ThemeContext);

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
            onClick={(e) => changeBackground(e, setChatConfigObject)}
            onMouseEnter={(e) => selectBackground(e, setChatConfigObject)}
            onMouseLeave={(e) => selectBackground(e, setChatConfigObject)}
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
