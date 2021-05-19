import { useRef, useContext } from "react";
import { ThemeContext } from "../../theme-context";

import { FaUpload } from "react-icons/fa";

import astronauta from "../../default-avatars/astronauta.png";
import hacker from "../../default-avatars/hacker.png";
import niña1 from "../../default-avatars/nina-1.png";
import niña2 from "../../default-avatars/nina-2.png";
import niña3 from "../../default-avatars/nina-3.png";
import niña4 from "../../default-avatars/nina-4.png";
import ninja from "../../default-avatars/ninja.png";
import rey from "../../default-avatars/rey.png";

import "./Avatars.css";

const avatarsCollection = [astronauta, hacker, niña1, niña2, niña3, niña4, ninja, rey];

function Avatars({ user, newProfile, setNewProfile }) {
  const theme = useContext(ThemeContext);
  const fileInputRef = useRef(null);

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
      setNewProfile({
        name: newProfile.name ? newProfile.name : user.name,
        avatar: e.target.result,
      });
    });

    reader.readAsDataURL(file);
  }

  return (
    <div className="avatars-collection" data-testid="avatars">
      {avatarsCollection.map((avatarSrc, index) => {
        return (
          <img
            key={index}
            src={avatarSrc}
            alt="User avatar"
            loading="lazy"
            onClick={(e) => {
              setNewProfile({
                name: newProfile.name ? newProfile.name : user.name,
                avatar: e.target.src,
              });
            }}
          />
        );
      })}
      <div className="custom-avatar-container">
        <input
          type="file"
          name="custom-avatar"
          className="custom-avatar-input"
          accept=".jpg, .jpeg, .png"
          ref={fileInputRef}
          onChange={(e) => handleAvatarUpload(e)}
        />
        <button
          className="custom-avatar-btn"
          title="Pick a custom avatar!"
          style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
          onClick={() => fileInputRef.current.click()}
        >
          <FaUpload />
        </button>
      </div>
    </div>
  );
}

export default Avatars;
