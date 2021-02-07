import { screen, render, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChatPanel from "./ChatPanel";

import testSocket from "../../test_utils/testSocket";
import { mockUser, mockActiveUsers } from "../../test_utils/mockData";

describe("ChatPanel component stand alone tests", () => {
	beforeEach(() => {
		render(<ChatPanel user={mockUser} />);
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
	beforeEach(() => {
		render(<ChatPanel user={mockUser} />);
		act(() => {
			testSocket.emit("test:active-users", mockActiveUsers);
		});
	});

	test("Should show a selected user", async () => {
		const activeUsers = screen.getAllByTestId("active-user");
		const randomActiveUser = Math.floor(Math.random() * (mockActiveUsers.length - 1));

		await waitFor(() => {
			userEvent.click(activeUsers[randomActiveUser]);
		});

		const friend = await screen.findByTestId("friend");

		expect(friend).toBeInTheDocument();
		expect(screen.getByAltText(mockActiveUsers[randomActiveUser].name)).toBeInTheDocument();
		expect(screen.getByText(mockActiveUsers[randomActiveUser].name)).toBeInTheDocument();
	});

	test("Should not render any message when start a new chat", async () => {
		const activeUsers = await screen.findAllByTestId("active-user");
		const randomActiveUser = Math.floor(Math.random() * (mockActiveUsers.length - 1));

		await waitFor(() => {
			userEvent.click(activeUsers[randomActiveUser]);
		});

		expect(screen.queryByRole("list", { name: "messages" })).not.toBeInTheDocument();
		expect(screen.queryByAllRole("checkbox")).not.toBeInTheDocument();
	});
});

describe("When user clicks on settings menu", () => {
	beforeEach(() => {
		render(<ChatPanel user={mockUser} />);
	});

	test("Should render profile when click on it", async () => {
		const profile = screen.getByRole("listitem", { name: "profile" });

		await waitFor(() => {
			userEvent.click(profile);
		});

		const profileComponent = await screen.findByTestId("profile");
		expect(profileComponent).toBeInTheDocument();
		expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
	});

	test("Should render background options when click on it", async () => {
		const background = screen.getByRole("listitem", { name: "background" });

		await waitFor(() => {
			userEvent.click(background);
		});

		const backgroundComponent = await screen.findByTestId("background");
		expect(backgroundComponent).toBeInTheDocument();
		expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
	});

	test("Should render theme options when click on it", async () => {
		const theme = screen.getByRole("listitem", { name: "theme" });

		await waitFor(() => {
			userEvent.click(theme);
		});

		const themeComponent = await screen.findByTestId("theme");
		expect(themeComponent).toBeInTheDocument();
		expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
	});
});
