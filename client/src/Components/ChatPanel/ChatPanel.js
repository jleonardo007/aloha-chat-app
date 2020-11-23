import "./ChatPanel.css";
import avatar from "../../default-avatars/astronauta.png";

function ChatPanel() {
  return (
    <section className="chat-panel">
      <div className="chat-info">
        <div className="user-container">
          <div className="user-info">
            <img src={avatar} alt="User avatar" className="user-avatar" />
            <div className="user-name"></div>
            <div className="menu-container"></div>
          </div>
        </div>
        <div className="active-users-container">
          <div className="user-info">
            <img src={avatar} alt="User avatar" className="user-avatar" />
            <div className="user-name"></div>
          </div>

          <div className="user-info">
            <div className="user-avatar"></div>
            <div className="user-name"></div>
          </div>

          <div className="user-info">
            <div className="user-avatar"></div>
            <div className="user-name"></div>
          </div>
        </div>
      </div>
      <div className="chat">
        <div className="receptor-container">
          <div className="user-info">
            <img src={avatar} alt="User avatar" className="user-avatar" />
            <div className="user-name"></div>
            <div className="menu-container"></div>
          </div>
        </div>
        <div className="messages-container"></div>
        <div className="chat-controls-container"></div>
      </div>
    </section>
  );
}

export default ChatPanel;
