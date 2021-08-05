import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import useCreateUser from "./hooks";
import "./styles.css";

import astronauta from "../../default-avatars/astronauta.png";
import hacker from "../../default-avatars/hacker.png";
import niña1 from "../../default-avatars/nina-1.png";
import niña2 from "../../default-avatars/nina-2.png";
import niña3 from "../../default-avatars/nina-3.png";
import niña4 from "../../default-avatars/nina-4.png";
import ninja from "../../default-avatars/ninja.png";
import rey from "../../default-avatars/rey.png";
import noAvatar from "../../default-avatars/no-avatar.png";
import heroImage from "../../chat-icons/hero-image.webp";

const avatarsCollection = [astronauta, hacker, niña1, niña2, niña3, niña4, ninja, rey];

function CreateUserName({ createUserName }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserName(e, inputValue);
  };

  return (
    <section className="welcome-page" data-testid="username-page">
      <div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }}></div>
      <div className="welcome__container">
        <div className="welcome__title">
          <h1>Make new friends, just say</h1>
          <h2 className="app-title">Aloha!</h2>
        </div>
        <div className="create-name-container">
          <form className="form" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-label">
              <label htmlFor="user-name">Your name:</label>
            </div>
            <div className="form-input">
              <input
                type="text"
                required
                maxLength={30}
                id="user-name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="form-btn">
              <button type="submit" className="create-btn">
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function CreateUserAvatar({ avatar, avatarSelection, avatarUpload, createUser }) {
  const fileInputRef = useRef(null);

  return (
    <section className="avatar-page" data-testid="avatar-page">
      <div className="avatar__title">
        <h1>Pick an avatar!</h1>
      </div>
      <div className="avatar__container">
        <div className="avatar__preview">
          <div
            className="avatar-image"
            style={{ backgroundImage: `url(${avatar ? avatar : noAvatar})` }}
          />
          <div className="join-btn-container">
            {avatar && (
              <button className="create-btn" onClick={() => createUser()}>
                Join!
              </button>
            )}
          </div>
        </div>
        <div className="default-avatars">
          <div className="collection">
            {avatarsCollection.map((avatarSrc, index) => {
              return (
                <div
                  key={index}
                  style={{ backgroundImage: `url(${avatarSrc})` }}
                  data-image={avatarSrc}
                  className="avatar-image"
                  onClick={(e) => avatarSelection(e)}
                />
              );
            })}
            <div className="custom-avatar-container">
              <input
                type="file"
                name="custom-avatar"
                className="custom-avatar-input"
                accept=".png, .jpeg,.jpg, .webp"
                ref={fileInputRef}
                onChange={(e) => avatarUpload(e)}
              />
              <button
                className="custom-avatar-btn"
                title="Pick a custom avatar!"
                onClick={() => fileInputRef.current.click()}
              >
                <FontAwesomeIcon icon={faUpload} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CreateUser({ dispatch }) {
  const { user, ...features } = useCreateUser(dispatch);

  return !user.name ? (
    <CreateUserName createUserName={features.createUserName} />
  ) : (
    <CreateUserAvatar
      avatar={user.avatar}
      avatarSelection={features.avatarSelection}
      avatarUpload={features.avatarUpload}
      createUser={features.createUser}
    />
  );
}
