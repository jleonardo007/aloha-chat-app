import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChatPanel from "./ChatPanel";
import ChatInfo from "../ChatInfo/ChatInfo";
import Friend from "../Friend/Friend";
import Profile from "../Profile/Profile";

import testSocket from "../../test_utils/testSocket";
import { mockUser, mockFriend, mockActiveUsers } from "../../test_utils/mockData";

describe("ChatPanel component stand alone tests", () => {
  beforeEach(() => {
    render(
      <ChatPanel
        user={mockUser}
        friend={null}
        settingOption="no-render-options"
        chatInfo={<ChatInfo user={mockUser} />}
      />
    );
  });

  test("Info are showed when user not chating", () => {
    const noChatImg = screen.getByAltText(/start talk/i);
    const noChatTitle = screen.getByText(/talk to somebody/i);

    expect(noChatImg).toBeInTheDocument();
    expect(noChatTitle).toBeInTheDocument();
  });

  test("Show info when there is not active users", () => {
    const noUsersImg = screen.getByAltText(/no users/i);
    const noUsersTitle = screen.getByText(/no active users/i);

    expect(noUsersImg).toBeInTheDocument();
    expect(noUsersTitle).toBeInTheDocument();
  });
});

describe("When user starts a new chat", () => {
  test("Should show a selected friend", async () => {
    const dispatch = jest.fn();
    const randomActiveUser = Math.floor(Math.random() * mockActiveUsers.length);

    render(
      <ChatPanel
        user={mockUser}
        friend={mockActiveUsers[randomActiveUser]}
        settingOption="no-render-options"
        dispatch={dispatch}
        friendComponent={<Friend friend={mockActiveUsers[randomActiveUser]} />}
        chatInfo={<ChatInfo user={mockUser} dispatch={dispatch} />}
        profile={<Profile user={mockUser} dispatch={dispatch} />}
      />
    );

    act(() => {
      testSocket.emit("test:active-users", mockActiveUsers);
    });

    const activeUsers = screen.getAllByTestId("active-user");
    userEvent.click(activeUsers[randomActiveUser]);
    expect(dispatch).toHaveBeenCalledTimes(1);

    const friend = screen.getByTestId("friend");
    expect(friend).toBeInTheDocument();
    expect(friend).toContainElement(screen.getByAltText(mockActiveUsers[randomActiveUser].name));
    expect(friend).toHaveTextContent(mockActiveUsers[randomActiveUser].name);
  });

  test("Should not render any message when start a new chat", async () => {
    render(
      <ChatPanel
        user={mockUser}
        friend={mockFriend}
        settingOption="no-render-options"
        friendComponent={<Friend friend={mockFriend} />}
        chatInfo={<ChatInfo user={mockUser} />}
        profile={<Profile user={mockUser} />}
      />
    );

    expect(screen.queryByRole("list", { name: "messages" })).toBeEmptyDOMElement();
  });
});

describe("When user clicks on settings menu", () => {
  test("Should toggle profile when click on it", async () => {
    const dispatch = jest.fn();

    const { rerender } = render(
      <ChatPanel
        user={mockUser}
        friend={mockFriend}
        settingOption="no-render-options"
        dispatch={dispatch}
        chatInfo={<ChatInfo user={mockUser} dispatch={dispatch} />}
        profile={<Profile user={mockUser} dispatch={dispatch} />}
      />
    );
    expect(screen.queryByTestId("profile")).not.toBeInTheDocument();
    expect(screen.getByTestId("chat-info")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("menu"));
    const profile = await screen.findByRole("listitem", { name: "profile" });

    userEvent.click(profile);
    expect(dispatch).toHaveBeenCalledTimes(1);

    rerender(
      <ChatPanel
        user={mockUser}
        friend={mockFriend}
        settingOption="profile-settings"
        dispatch={dispatch}
        chatInfo={<ChatInfo user={mockUser} dispatch={dispatch} />}
        profile={<Profile user={mockUser} dispatch={dispatch} />}
      />
    );

    expect(screen.getByTestId("profile")).toBeInTheDocument();
    expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
  });

  test("Should toggle background options when click on it", async () => {
    const dispatch = jest.fn();

    const { rerender } = render(
      <ChatPanel
        user={mockUser}
        friend={mockFriend}
        settingOption="no-render-options"
        dispatch={dispatch}
        chatInfo={<ChatInfo user={mockUser} dispatch={dispatch} />}
        profile={<Profile user={mockUser} dispatch={dispatch} />}
      />
    );
    expect(screen.queryByTestId("backgrounds")).not.toBeInTheDocument();
    expect(screen.getByTestId("chat-info")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("menu"));
    const background = await screen.findByRole("listitem", { name: "background" });

    userEvent.click(background);
    expect(dispatch).toHaveBeenCalledTimes(1);

    rerender(
      <ChatPanel
        user={mockUser}
        friend={mockFriend}
        settingOption="background-settings"
        dispatch={dispatch}
        chatInfo={<ChatInfo user={mockUser} dispatch={dispatch} />}
        profile={<Profile user={mockUser} dispatch={dispatch} />}
      />
    );

    expect(screen.getByTestId("backgrounds")).toBeInTheDocument();
    expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
  });

  test("Should toggle theme options when click on it", async () => {
    const dispatch = jest.fn();

    const { rerender } = render(
      <ChatPanel
        user={mockUser}
        friend={mockFriend}
        settingOption="no-render-options"
        dispatch={dispatch}
        chatInfo={<ChatInfo user={mockUser} dispatch={dispatch} />}
        profile={<Profile user={mockUser} dispatch={dispatch} />}
      />
    );

    expect(screen.queryByTestId("theme")).not.toBeInTheDocument();
    expect(screen.getByTestId("chat-info")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("menu"));
    const theme = await screen.findByRole("listitem", { name: "theme" });

    userEvent.click(theme);
    expect(dispatch).toHaveBeenCalledTimes(1);

    rerender(
      <ChatPanel
        user={mockUser}
        friend={mockFriend}
        settingOption="theme-settings"
        dispatch={dispatch}
        chatInfo={<ChatInfo user={mockUser} dispatch={dispatch} />}
        profile={<Profile user={mockUser} dispatch={dispatch} />}
      />
    );

    expect(screen.getByTestId("theme")).toBeInTheDocument();
    expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
  });
});
