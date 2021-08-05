import { useState } from "react";
import {
  mouseHover,
  selectOptions,
  changeProfile,
  changeUserName,
  avatarSelection,
  avatarUpload,
} from "./handlers";

export default function useProfile(user, dispatch) {
  const [profileState, setProfileState] = useState({
    toggleAvatarButton: false,
    settingsToRender: "",
  });
  const [newProfile, setNewProfile] = useState({
    name: "",
    avatar: "",
  });

  return {
    profileState,
    newProfile,
    mouseHover: (e) => mouseHover(e, setProfileState),
    selectOptions: (e) => selectOptions(e, setProfileState),
    changeProfile: () => changeProfile(user, newProfile, dispatch),
    changeUserName: (e, inputValue) =>
      changeUserName(e, inputValue, user, newProfile, setNewProfile),
    avatarSelection: (e) => avatarSelection(e, user, setNewProfile),
    avatarUpload: (e) => avatarUpload(e, user, setNewProfile),
  };
}
