export function getFriend(user, dispatch) {
  dispatch({
    type: "GET_FRIEND",
    user,
  });
}
