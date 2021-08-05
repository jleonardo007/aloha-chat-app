import { useContext } from "react";
import { ThemeContext } from "../../theme-context";
import Menu from "../Menu";
import useFriendActions from "./hooks";
import { setchatConfig } from "./handlers";
import "./styles.css";

export default function Friend({ friend, setChatConfigObject }) {
  const theme = useContext(ThemeContext);
  const action = useFriendActions(friend);

  return (
    <div className="user-info" data-testid="friend">
      <div className="user-avatar" style={{ backgroundImage: `url(${friend.avatar})` }} />
      <div className="user-name">
        <span>{friend.name}</span>
        <span className="action-label" data-testid="action-label">
          {action}
        </span>
      </div>
      <div className="menu-container">
        <Menu>
          <ul
            className="menu"
            aria-label="chat settings"
            style={{ backgroundColor: theme.background, border: `1px solid ${theme.fontColor}` }}
          >
            <li
              className="menu__item"
              aria-label="select messages"
              onMouseDown={() => setchatConfig("select-messages", setChatConfigObject)}
            >
              Select messages
            </li>
            <li
              className="menu__item"
              aria-label="empty chat"
              onMouseDown={() => setchatConfig("empty-chat", setChatConfigObject)}
            >
              Empty chat
            </li>
            <li
              className="menu__item"
              aria-label="enter to send"
              onMouseDown={() => setchatConfig("enter-to-send", setChatConfigObject)}
            >
              Enter to send
            </li>
          </ul>
        </Menu>
      </div>
    </div>
  );
}
