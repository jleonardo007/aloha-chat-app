import { useEffect, useRef, useContext } from "react";
import { ThemeContext, themes } from "../../theme-context";
import "./styles.css";

export default function Theme({ dispatch }) {
  const theme = useContext(ThemeContext);
  const darkRef = useRef(null);
  const lightRef = useRef(null);

  useEffect(() => {
    if (theme.type === "light" && lightRef.current) lightRef.current.defaultChecked = true;
    else if (theme.type === "dark" && darkRef.current) darkRef.current.defaultChecked = true;
  }, [theme]);

  function handelSelectTheme(e) {
    let theme = null;
    if (e.target.id === "dark") {
      theme = themes.dark;
      dispatch({ type: "CHANGE_THEME", theme });
    } else if (e.target.id === "light") {
      theme = themes.light;
      dispatch({ type: "CHANGE_THEME", theme });
    }
  }

  return (
    <div className="theme-container" data-testid="theme">
      <div className="light-theme">
        <label htmlFor="light">Light Theme</label>
        <input
          type="radio"
          name="theme"
          id="light"
          onClick={(e) => handelSelectTheme(e)}
          ref={lightRef}
        />
      </div>
      <div className="dark-theme">
        <label htmlFor="dark">Dark Theme</label>
        <input
          type="radio"
          name="theme"
          id="dark"
          onClick={(e) => handelSelectTheme(e)}
          ref={darkRef}
        />
      </div>
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
