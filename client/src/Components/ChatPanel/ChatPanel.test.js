import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockedSocket from "socket.io-mock";

import CreateUser from "../../Components/CreateUser/CreateUser";
import ChatPanel from "./ChatPanel";
import userAvatar1 from "../../default-avatars/astronauta.png";
import userAvatar2 from "../../default-avatars/nina-2.png";
import userAvatar3 from "../../default-avatars/rey.png";

describe("Chat panel test", () => {
  test("Render user info and chat's initial state", () => {
    const createUser = render(<CreateUser />).queryByRole("region");
    expect(createUser).not.toBeInTheDocument();

    render(<ChatPanel />);

    const userInfo = screen.getByTestId("user-info");

    const noChatImg = screen.getByAltText(/start talk/i);
    const noChatTitle = screen.getByText(/talk to somebody/i);

    expect(userInfo).toContainElement(screen.getByRole("img"));
    expect(userInfo).toContainElement(screen.getByRole("list"));
    expect(userInfo).toContainElement(screen.getByText(/jonh doe/i));
    expect(noChatImg).toBeInTheDocument();
    expect(noChatTitle).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
  });

  test("Render active users empty list", () => {
    render(<ChatPanel />);

    const socket = new MockedSocket();
    const noUsersImg = screen.getByAltText(/no users/i);
    const noUsersTitle = screen.getByText(/no active users/i);
    const activeUsers = screen.queryAllByTestId(/active user/i);
    const mockActiveUsers = [];

    socket.on("get:active-users", (activeUsers) => {
      expect(activeUsers).toHaveLength(0);
    });

    socket.socketClient.emit("get:active-users", mockActiveUsers);

    expect(activeUsers).not.toBeInTheDocument();
    expect(noUsersImg).toBeInTheDocument();
    expect(noUsersTitle).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
  });

  test("Render active users list", () => {
    render(<ChatPanel />);

    const socket = new MockedSocket();
    const mockActiveUsers = [
      {
        name: "John Doe",
        avatarPath: userAvatar1,
      },
      {
        name: "Jane Doe",
        avatarPath: userAvatar2,
      },
      {
        name: "King T'chala",
        avatarPath: userAvatar3,
      },
    ];

    socket.on("get:active-users", (activeUsers) => {
      expect(activeUsers).toHaveLength(3);
      expect(activeUsers).toEqual(mockActiveUsers);
    });

    socket.socketClient.emit("get:active-users", mockActiveUsers);

    const activeUsers = screen.getAllByTestId("active-user");

    expect(activeUsers).toHaveLength(mockActiveUsers.length);
    expect(activeUsers).toBeInTheDocument();
    expect(activeUsers).not.toBeEmptyDOMElement();
    expect(activeUsers).toContainElement(screen.getByRole("img"));
    expect(activeUsers).toHaveTextContent();
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
  });

  test("Render chat", async () => {
    render(<ChatPanel />);

    const activeUsers = screen.getAllByTestId("active-user");

    userEvent.click(activeUsers[1]);

    await waitFor(() => {
      expect(screen.queryByAltText(/start talk/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/talk to somebody/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId("chat")).toBeInTheDocument();
      expect(screen.queryByTestId("chat")).not.toBeEmptyDOMElement();
    });

    const receptor = await screen.findByTestId("receptor");

    expect(receptor).toBeInTheDocument();
    expect(receptor).toContainElement(screen.getByRole("img"));
    expect(receptor).toContainElement(screen.getByRole("list"));
    expect(receptor).toContainElement(screen.getByText(/jane doe/i));
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
  });
});
