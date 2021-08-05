import { useContext } from "react";
import { ThemeContext } from "../../theme-context";
import User from "../User";
import { useActiveUsers, useNewMessagesCounter } from "./hooks";
import noUsers from "../../chat-icons/no-active-users.png";
import "./styles.css";

function ActiveUser({ user, activeUser, currentFriend, getFriend }) {
  const theme = useContext(ThemeContext);
  const { counter, resetCounter } = useNewMessagesCounter(user, activeUser, currentFriend);

  return (
    <div
      className="user-info"
      data-testid="active-user"
      onClick={() => {
        getFriend(activeUser);
        resetCounter();
      }}
    >
      <div className="user-avatar" style={{ backgroundImage: `url(${activeUser.avatar})` }} />
      <div className="user-name">
        <span>{activeUser.name}</span>
      </div>
      {counter > 0 && (
        <div className="new-messages-counter" style={{ backgroundColor: theme.primaryColor }}>
          <span data-testid="new-messages-counter">{counter}</span>
        </div>
      )}
    </div>
  );
}

export default function ChatInfo({ user, currentFriend, dispatch }) {
  const { activeUsers, getFriend } = useActiveUsers(currentFriend, dispatch);

  return (
    <div className="chat-info" data-testid="chat-info">
      <div className="user-container">
        <User user={user} dispatch={dispatch} />
      </div>
      {activeUsers.length === 0 ? (
        <div className="no-active-users">
          <div className="no-active-users-container">
            <span>No active users</span>
            <img src={noUsers} alt="No users" loading="lazy" />
          </div>
        </div>
      ) : (
        <div className="active-users-container">
          {activeUsers.map((activeUser, index) => (
            <ActiveUser
              key={index}
              user={user}
              activeUser={activeUser}
              currentFriend={currentFriend}
              getFriend={getFriend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
