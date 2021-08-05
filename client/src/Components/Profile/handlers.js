import socketClient from "../../socket-client";
import validateImage from "../../validate-image";

export function mouseHover(e, setProfileState) {
  if (e.type === "mouseleave")
    setProfileState((prevState) => {
      return {
        ...prevState,
        toggleAvatarButton: false,
      };
    });
  if (e.type === "mouseenter")
    setProfileState((prevState) => {
      return {
        ...prevState,
        toggleAvatarButton: true,
      };
    });
}

export function selectOptions(e, setProfileState) {
  const trigger = e.target.getAttribute("data-trigger-value");

  if (trigger === "change-avatar")
    setProfileState((prevState) => {
      return {
        prevState,
        settingsToRender: "avatar-settings",
      };
    });
  else if (trigger === "edit-name")
    setProfileState((prevState) => {
      return {
        ...prevState,
        settingsToRender: "name-settings",
      };
    });
  //Next conditional was made due to handler doesn't propagate in all svg icon elements.
  else if (
    e.target.parentElement.parentElement.getAttribute("data-trigger-value") === "change-avatar"
  )
    setProfileState((prevState) => {
      return {
        ...prevState,
        settingsToRender: "avatar-settings",
      };
    });
  else
    setProfileState((prevState) => {
      return {
        ...prevState,
        settingsToRender: "name-settings",
      };
    });
}

export function changeProfile(user, newProfile, dispatch) {
  if (newProfile.name || newProfile.avatar) {
    dispatch({ type: "NEW_PROFILE", newProfile });
    socketClient.emit("change-profile", { ...user, ...newProfile });
  } else dispatch({ type: "RENDER_CHAT_INFO" });
}

export function changeUserName(e, inputValue, user, newProfile, setNewProfile) {
  e.preventDefault();
  setNewProfile({
    name: inputValue,
    avatar: newProfile.avatar ? newProfile.avatar : user.avatar,
  });
}

export function avatarSelection(e, user, setNewProfile) {
  const avatar = e.target.getAttribute("data-image");
  console.log(avatar);
  setNewProfile((prevState) => {
    return {
      ...prevState,
      name: prevState.name ? prevState.name : user.name,
      avatar,
    };
  });
}

export function avatarUpload(e, user, setNewProfile) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", (e) => {
    setNewProfile((prevState) => {
      return {
        ...prevState,
        name: prevState.name ? prevState.name : user.name,
        avatar: e.target.result,
      };
    });
  });

  if (file) {
    if (validateImage(file)) reader.readAsDataURL(file);
    else alert("Upload a image only!");
  }
}
