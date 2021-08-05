export default function reducer(state, action) {
  switch (action.type) {
    case "CREATE_USER":
      return {
        ...state,
        userIsCreated: true,
        user: {
          name: action.userName,
          avatar: action.userAvatar,
        },
      };

    case "USER_CONNECTED":
      return {
        ...state,
        user: {
          ...action.user,
        },
      };

    case "GET_FRIEND":
      return {
        ...state,
        friend: action.user,
      };

    case "RENDER_PROFILE_SETTINGS":
      return {
        ...state,
        settingOptionToRender: "profile-settings",
      };

    case "RENDER_BACKGROUND_SETTINGS":
      return {
        ...state,
        settingOptionToRender: "background-settings",
      };

    case "RENDER_THEME_SETTINGS":
      return {
        ...state,
        settingOptionToRender: "theme-settings",
      };

    case "RENDER_CHAT_INFO":
      return {
        ...state,
        settingOptionToRender: "no-render-options",
      };

    case "NEW_PROFILE":
      return {
        ...state,
        settingOptionToRender: "no-render-options",
        user: {
          ...state.user,
          ...action.newProfile,
        },
      };

    case "CHANGE_THEME":
      return {
        ...state,
        theme: action.theme,
      };

    default:
      return state;
  }
}
