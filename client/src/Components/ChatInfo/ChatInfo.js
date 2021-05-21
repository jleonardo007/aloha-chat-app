import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../theme-context";

import User from "../User/User";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

import noUsers from "../../chat-icons/no-active-users.png";
import "./ChatInfo.css";

function ActiveUser({ user, activeUser, currentFriend, dispatch }) {
  const theme = useContext(ThemeContext);
  const [newMessagesCounter, setNewMessagesCounter] = useState(() =>
    localStorage.getItem(`${user.id}_${activeUser.id}` || 0)
  );

  useEffect(() => {
    if (currentFriend)
      socketClient.on("new-messages-counter", (friend) => {
        if (activeUser.id === friend.id && currentFriend.id !== friend.id)
          setNewMessagesCounter((prevState) => prevState + 1);
      });
    else
      socketClient.on("new-messages-counter", (friend) => {
        if (activeUser.id === friend.id) setNewMessagesCounter((prevState) => prevState + 1);
      });

    return () => {
      socketClient.off("new-messages-counter");
    };
  }, [activeUser, currentFriend]);

  useEffect(() => {
    if (newMessagesCounter > 0)
      localStorage.setItem(`${user.id}_${activeUser.id}`, newMessagesCounter);
    else if (newMessagesCounter === 0 && localStorage.getItem(`${user.id}_${activeUser.id}`))
      localStorage.removeItem(`${user.id}_${activeUser.id}`);
  });

  return (
    <div
      className="user-info"
      data-testid="active-user"
      onClick={() => {
        dispatch({
          type: "GET_FRIEND",
          user: activeUser,
        });

        setNewMessagesCounter(0);
      }}
    >
      <div className="user-avatar" style={{ backgroundImage: `url(${activeUser.avatar})` }} />
      <div className="user-name">
        <span>{activeUser.name}</span>
      </div>
      {newMessagesCounter > 0 && (
        <div className="new-messages-counter" style={{ backgroundColor: theme.primaryColor }}>
          <span data-testid="new-messages-counter">{newMessagesCounter}</span>
        </div>
      )}
    </div>
  );
}

function ChatInfo({ user, currentFriend, dispatch }) {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      testSocket.on("test:active-users", (users) => {
        setActiveUsers(users);
      });
    } else {
      socketClient.emit("get:active-users");
      socketClient.on("get:active-users", (users) => {
        setActiveUsers(users.filter((user) => user.id !== socketClient.id));
      });
    }
    return () => {
      if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:active-users");
      else socketClient.off("get:active-users");
    };
  }, [currentFriend]);

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
              dispatch={dispatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatInfo;
