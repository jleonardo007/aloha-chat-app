import validateImage from "../../validate-image";

export function createUser(user, dispatch) {
  dispatch({
    type: "CREATE_USER",
    userName: user.name,
    userAvatar: user.avatar,
  });
}

export function createUserName(e, inputValue, setUser) {
  e.preventDefault();
  setUser((prevState) => {
    return {
      ...prevState,
      name: inputValue,
    };
  });
}

export function avatarSelection(e, setUser) {
  const avatar = e.target.getAttribute("data-image");
  setUser((prevState) => {
    return {
      ...prevState,
      avatar,
    };
  });
}

export function avatarUpload(e, setUser) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", (e) => {
    setUser((prevState) => {
      return {
        ...prevState,
        avatar: e.target.result,
      };
    });
  });

  if (file) {
    if (validateImage(file)) reader.readAsDataURL(file);
    else alert("Upload a image only!");
  }
}
