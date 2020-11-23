import "./CreateUser.css";
import avatar from "../../default-avatars/astronauta.png";

function CreateUserName() {
  return (
    <section className="welcome-page">
      <div className="welcome__container">
        <div className="welcome__title"></div>
        <div className="create-name-container"></div>
      </div>
    </section>
  );
}

function CreateUserAvatar() {
  return (
    <section className="avatar-page">
      <div className="avatar__title">
        <h1>texto</h1>
      </div>
      <div className="avatar__container">
        <div className="avatar__preview">
          <img src={avatar} alt="User avatar" className="avatar-image" />
          <div className="join-btn-container"></div>
        </div>
        <div className="default-avatars">
          <div className="collection">
            <img src={avatar} alt="User avatar" className="avatar-image" />
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
            <div className="avatar-image"></div>
          </div>
          <div className="upload-avatar"></div>
        </div>
      </div>
    </section>
  );
}

function CreateUser() {
  return !true ? <CreateUserName /> : <CreateUserAvatar />;
}

export default CreateUser;
