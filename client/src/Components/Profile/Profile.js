import { useState, useContext } from "react";
import { ThemeContext } from "../../theme-context";

import Avatars from "../Avatars/Avatars";
import NameSettings from "../NameSettings/NameSettings";
import { BsPencil } from "react-icons/bs";
import { AiOutlineCamera } from "react-icons/ai";

import socketClient from "../../socket-client";
import "./Profile.css";

function Profile({ user, dispatch }) {
  const theme = useContext(ThemeContext);
  const [toggleSelectAvatarButton, setToggleSelectAvatarButton] = useState(false);
  const [settingsToRender, setSettingsToRender] = useState("");
  const [newProfile, setNewProfile] = useState({ name: "", avatar: "" });

  function handleMouseHover(e) {
    if (e.type === "mouseleave") setToggleSelectAvatarButton(false);
    if (e.type === "mouseenter") setToggleSelectAvatarButton(true);
  }

  function handleSelectOptions(e) {
    const trigger = e.target.getAttribute("data-trigger-value");

    if (trigger === "change-avatar") setSettingsToRender("avatar-settings");
    else if (trigger === "edit-name") setSettingsToRender("name-settings");
    //Next conditional was made due to handler doesn't propagate in all svg icon elements.
    else if (
      e.target.parentElement.parentElement.getAttribute("data-trigger-value") === "change-avatar"
    )
      setSettingsToRender("avatar-settings");
    else setSettingsToRender("name-settings");
  }

  function handleChageProfile() {
    if (newProfile.name || newProfile.avatar) {
      dispatch({ type: "NEW_PROFILE", newProfile });
      socketClient.emit("change-profile", { ...user, ...newProfile });
    } else dispatch({ type: "RENDER_CHAT_INFO" });
  }

  return (
    <>
      <div className="profile-container" data-testid="profile">
        <div
          className="profile-image"
          style={{
            backgroundImage: `url(${newProfile.avatar ? newProfile.avatar : user.avatar})`,
            backgroundSize: "cover",
          }}
          data-testid="profile-image"
          onMouseEnter={(e) => handleMouseHover(e)}
          onMouseLeave={(e) => handleMouseHover(e)}
        >
          {toggleSelectAvatarButton ? (
            <button
              className="change-avatar-btn"
              aria-label="select avatar button"
              data-trigger-value="change-avatar"
              onClick={(e) => handleSelectOptions(e)}
              style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
            >
              <AiOutlineCamera data-trigger-value="change-avatar" />
            </button>
          ) : null}
        </div>
        <div className="profile-name">
          <span>{newProfile.name ? newProfile.name : user.name}</span>
          <button
            className="edit-name-btn"
            aria-label="edit name button"
            onClick={(e) => handleSelectOptions(e)}
            data-trigger-value="edit-name"
            style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
          >
            <BsPencil data-trigger-value="edit-name" />
          </button>
        </div>
        <div className="change-profile">
          <button
            className="change-profile-btn"
            aria-label="change profile button"
            onClick={() => {
              handleChageProfile();
            }}
            style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
          >
            {newProfile.name || newProfile.avatar ? "Change" : "Back"}
          </button>
        </div>
      </div>
      <div className="settings-container">
        {settingsToRender === "avatar-settings" ? (
          <Avatars user={user} newProfile={newProfile} setNewProfile={setNewProfile} />
        ) : settingsToRender === "name-settings" ? (
          <NameSettings user={user} newProfile={newProfile} setNewProfile={setNewProfile} />
        ) : null}
      </div>
    </>
  );
}

export default Profile;
