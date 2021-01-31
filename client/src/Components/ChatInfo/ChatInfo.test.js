import { screen, render, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChatInfo from "./ChatInfo";
import Friend from "../Friend/Friend";
import Messages from "../Messages/Messages";

import testSocket from "../../test_utils/testSocket";
import { mockUser, mockActiveUsers, mockMessages } from "../../test_utils/mockData";

describe("ChatInfo component stand alone test", () => {
	beforeEach(() => {
		render(<ChatInfo user={mockUser} />);
		act(() => {
			testSocket.emit("test:active-users", mockActiveUsers);
		});
	});

	test("Show active users", () => {
		const activeUsers = screen.getAllByTestId("active-user");

		expect(activeUsers).toHaveLength(mockActiveUsers.length);
		activeUsers.forEach((activeUser, index) => {
			expect(activeUser).toBeInTheDocument();
			expect(activeUser).not.toBeEmptyDOMElement();
			expect(activeUser).toHaveTextContent(mockActiveUsers[index].name);
			expect(activeUser).toContainElement(screen.getByAltText(mockActiveUsers[index].name));
		});
	});

	test("Should render new messages counter", () => {
		const newMessagesCounter = screen.getAllByTestId("new-messages-counter");

		act(() => {
			testSocket.emit("test:new-messages", mockMessages.length);
		});

		newMessagesCounter.forEach((counter) => {
			expect(counter).toHaveTextContent(`${mockMessages.length}`);
		});
	});

	test("New messages counter should desappear when messages has been seen", () => {
		act(() => {
			testSocket.emit("test:seen-messages");
		});

		screen.queryAllByTestId("new-messages-counter").forEach((counter) => {
			expect(counter).not.toBeInTheDocument();
		});
	});
});

describe("When user starts a new chat", () => {
	beforeEach(() => {
		render(<ChatInfo user={mockUser} />);
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

		render(<Friend friend={activeUsers[randomActiveUser]} />);

		const friend = await screen.findByTestId("friend");

		expect(friend).toBeInTheDocument();
		expect(screen.getByAltText(mockActiveUsers[randomActiveUser].name)).toBeInTheDocument();
		expect(screen.getByText(mockActiveUsers[randomActiveUser].name)).toBeInTheDocument();
	});

	test("Should not render any message when start a new chat", async () => {
		const activeUsers = await screen.findAllByTestId("active-user");
		const randomActiveUser = Math.floor(Math.random() * (mockActiveUsers.length - 1));
		render(<Messages messasges={[]} />);

		await waitFor(() => {
			userEvent.click(activeUsers[randomActiveUser]);
		});

		expect(screen.queryByRole("list", { name: "messages" })).not.toBeInTheDocument();
		expect(screen.queryByAllRole("checkbox")).not.toBeInTheDocument();
	});
});
