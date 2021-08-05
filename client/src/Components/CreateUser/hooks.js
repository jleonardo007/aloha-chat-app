import { useState } from "react";
import { createUserName, avatarSelection, avatarUpload, createUser } from "./handlers";

export default function useCreateUser(dispatch) {
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });

  return {
    user,
    createUserName: (e, inputValue) => createUserName(e, inputValue, setUser),
    avatarSelection: (e) => avatarSelection(e, setUser),
    avatarUpload: (e) => avatarUpload(e, setUser),
    createUser: () => createUser(user, dispatch),
  };
}
