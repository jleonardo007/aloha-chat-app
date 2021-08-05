import { useContext } from "react";
import { ThemeContext } from "../../theme-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faCamera } from "@fortawesome/free-solid-svg-icons";
import Avatars from "../Avatars";
import NameSettings from "../NameSettings";
import useProfile from "./hooks";
import "./styles.css";

export default function Profile({ user, dispatch }) {
  const theme = useContext(ThemeContext);
  const { profileState, newProfile, ...handlers } = useProfile(user, dispatch);

  return (
    <>
      <div className="profile-container" data-testid="profile">
        <div
          className="profile-image"
          style={{
            backgroundImage: `url(${newProfile.avatar ? newProfile.avatar : user.avatar})`,
          }}
          data-testid="profile-image"
          onMouseEnter={(e) => handlers.mouseHover(e)}
          onMouseLeave={(e) => handlers.mouseHover(e)}
        >
          {profileState.toggleAvatarButton && (
            <button
              className="change-avatar-btn"
              aria-label="select avatar button"
              data-trigger-value="change-avatar"
              onClick={(e) => handlers.selectOptions(e)}
              style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
            >
              <FontAwesomeIcon icon={faCamera} data-trigger-value="change-avatar" />
            </button>
          )}
        </div>
        <div className="profile-name">
          <span>{newProfile.name ? newProfile.name : user.name}</span>
          <button
            className="edit-name-btn"
            aria-label="edit name button"
            onClick={(e) => handlers.selectOptions(e)}
            data-trigger-value="edit-name"
            style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
          >
            <FontAwesomeIcon icon={faPencilAlt} data-trigger-value="edit-name" />
          </button>
        </div>
        <div className="change-profile">
          <button
            className="change-profile-btn"
            aria-label="change profile button"
            onClick={handlers.changeProfile}
            style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
          >
            {newProfile.name || newProfile.avatar ? "Change" : "Back"}
          </button>
        </div>
      </div>
      <div className="settings-container">
        {profileState.settingsToRender === "avatar-settings" ? (
          <Avatars
            avatarSelection={handlers.avatarSelection}
            avatarUpload={handlers.avatarUpload}
          />
        ) : (
          profileState.settingsToRender === "name-settings" && (
            <NameSettings userName={user.name} changeUserName={handlers.changeUserName} />
          )
        )}
      </div>
    </>
  );
}
