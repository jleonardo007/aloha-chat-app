import { useRef, useContext } from "react";
import { ThemeContext } from "../../theme-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

import astronauta from "../../default-avatars/astronauta.png";
import hacker from "../../default-avatars/hacker.png";
import niña1 from "../../default-avatars/nina-1.png";
import niña2 from "../../default-avatars/nina-2.png";
import niña3 from "../../default-avatars/nina-3.png";
import niña4 from "../../default-avatars/nina-4.png";
import ninja from "../../default-avatars/ninja.png";
import rey from "../../default-avatars/rey.png";

const avatarsCollection = [astronauta, hacker, niña1, niña2, niña3, niña4, ninja, rey];

export default function Avatars({ avatarSelection, avatarUpload }) {
  const theme = useContext(ThemeContext);
  const fileInputRef = useRef(null);

  return (
    <div className="avatars-collection" data-testid="avatars">
      {avatarsCollection.map((avatarSrc, index) => {
        return (
          <div
            className="avatar"
            key={index}
            style={{ backgroundImage: `url(${avatarSrc})` }}
            data-image={avatarSrc}
            onClick={(e) => avatarSelection(e)}
          />
        );
      })}
      <div className="profile-avatar-container">
        <input
          type="file"
          name="custom-avatar"
          className="custom-avatar-input"
          accept=".png, .jpeg,.jpg, .webp"
          ref={fileInputRef}
          onChange={(e) => avatarUpload(e)}
        />
        <button
          className="custom-avatar-btn profile-avatar-btn"
          title="Pick a custom avatar!"
          style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
          onClick={() => fileInputRef.current.click()}
        >
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </div>
    </div>
  );
}
