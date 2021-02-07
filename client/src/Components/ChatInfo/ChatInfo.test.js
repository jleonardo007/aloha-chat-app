import { screen, render, act } from "@testing-library/react";

import ChatInfo from "./ChatInfo";

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
