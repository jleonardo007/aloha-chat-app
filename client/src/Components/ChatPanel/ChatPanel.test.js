import { screen, render, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import testSocket from "../../test_utils/testSocket";
import ChatPanel from "./ChatPanel";

import userAvatar1 from "../../default-avatars/astronauta.png";
import userAvatar2 from "../../default-avatars/nina-2.png";
import userAvatar3 from "../../default-avatars/rey.png";

const mockedUser = {
	name: "Black Mamba",
	avatar: userAvatar1,
};

const mockActiveUsers = [
	{
		name: "John Doe",
		avatar: userAvatar1,
	},
	{
		name: "Jane Doe",
		avatar: userAvatar2,
	},
	{
		name: "King T'Chala",
		avatar: userAvatar3,
	},
];

describe("Chat panel tests", () => {
	beforeEach(() => {
		render(<ChatPanel user={mockedUser} />);
	});

	test("User info are showed", () => {
		const userInfo = screen.getByTestId("user-info");

		expect(userInfo).toContainElement(screen.getByAltText(/User avatar/i));
		expect(userInfo).toContainElement(screen.getByText("Black Mamba"));
	});

	test("Info are showed when user not chating", () => {
		const noChatImg = screen.getByAltText(/start talk/i);
		const noChatTitle = screen.getByText(/talk to somebody/i);

		expect(noChatImg).toBeInTheDocument();
		expect(noChatTitle).toBeInTheDocument();
	});

	test("Show list when there is not active users", () => {
		const noUsersImg = screen.getByAltText(/no users/i);
		const noUsersTitle = screen.getByText(/no active users/i);
		const activeUsers = screen.queryAllByTestId(/active user/i);

		activeUsers.forEach((activeUser) => {
			expect(activeUser).not.toBeInTheDocument();
		});
		expect(noUsersImg).toBeInTheDocument();
		expect(noUsersTitle).toBeInTheDocument();
	});

	test("Show list when there is active users", async () => {
		act(() => {
			testSocket.emit("test:active-users", mockActiveUsers);
		});

		const activeUsers = await screen.findAllByTestId("active-user");

		expect(activeUsers).toHaveLength(mockActiveUsers.length);
		activeUsers.forEach((activeUser, index) => {
			expect(activeUser).toBeInTheDocument();
			expect(activeUser).not.toBeEmptyDOMElement();
			expect(activeUser).toHaveTextContent(mockActiveUsers[index].name);
			expect(activeUser).toContainElement(screen.getByAltText(mockActiveUsers[index].name));
		});
	});

	test("Start talk with another users", async () => {
		act(() => {
			testSocket.emit("test:active-users", mockActiveUsers);
		});

		const activeUsers = await screen.findAllByTestId("active-user");
		const randomActiveUser = Math.floor(Math.random() * 3);

		await waitFor(() => {
			userEvent.click(activeUsers[randomActiveUser]);
		});

		expect(screen.queryByAltText(/start talk/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/talk to somebody/i)).not.toBeInTheDocument();
		expect(screen.queryByTestId("chat")).toBeInTheDocument();

		const receptor = await screen.findByTestId("receptor");

		expect(receptor).toBeInTheDocument();
		expect(receptor).toHaveTextContent(mockActiveUsers[randomActiveUser].name);
	});
});
