import { screen, render, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Friend from "./Friend";

import { mockFriend } from "../../test_utils/mockData";
import testSocket from "../../test_utils/testSocket";

describe("Friend component stand alone test", () => {
	beforeEach(() => {
		render(<Friend friend={mockFriend} />);
	});

	test("Friend info are showed", () => {
		const friendInfo = screen.getByTestId("friend");

		expect(friendInfo).toContainElement(screen.getByAltText(mockFriend.name));
		expect(friendInfo).toContainElement(screen.getByText(mockFriend.name));
	});

	test("Should render chat settings", async () => {
		const chatSettings = screen.getByRole("list", { name: "chat settings" });

		await waitFor(() => {
			userEvent.click(chatSettings);
		});
		expect(chatSettings).toBeVisible();
	});
});

describe("When user is chatting", () => {
	test("Should render friend's action", () => {
		render(<Friend friend={mockFriend} />);
		const actionLabel = screen.getByTestId("action-label");

		act(() => {
			testSocket.emit("test:friend-actions", "On line");
			expect(actionLabel).toHaveTextContent("On line");
		});

		act(() => {
			testSocket.emit("test:friend-actions", "Writing a message...");
			expect(actionLabel).toHaveTextContent("Writing a message...");
		});

		act(() => {
			testSocket.emit("test:friend-actions", "Recording audio...");
			expect(actionLabel).toHaveTextContent("Recording audio...");
		});

		act(() => {
			testSocket.emit("test:friend-actions", "Disconnected");
			expect(actionLabel).toHaveTextContent("Disconnected");
		});
	});
});

/* describe("When user clicks on friend's chat settings", () => {
	beforeEach(() => {
		render(<Friend friend={mockUser} />);
		render(<Messages message={mockMessages} />);
	});

	test("Should empty chat when user clicks on it", () => {
		const emptyButton = screen.getByRole("listitem", { name: "empty chat" });
		userEvent.click(emptyButton);

		expect(screen.getByRole("list", { name: "messages" })).toBeEmptyDOMElement();
	});

	test("Should toggle select messages checkboxes when user clicks on it", async () => {
		const selectButton = screen.getByRole("listitem", { name: "select messages" });
		userEvent.click(selectButton);

		const checkboxes = await screen.findAllByRole("checkbox");

		checkboxes.forEach((checkbox) => {
			expect(checkbox).toBeInTheDocument();
			expect(checkbox).not.toBeChecked();
		});

		await waitFor(() => {
			userEvent.click(selectButton);
		});

		checkboxes.forEach((checkbox) => {
			expect(checkbox).not.toBeChecked();
			expect(checkbox).not.toBeInTheDocument();
		});
	});

	test("Should select messages and show selected messages amount", async () => {
		render(<ChatControls />);

		const selectButton = screen.getByRole("listitem", { name: "select messages" });
		userEvent.click(selectButton);

		const checkboxes = await screen.findAllByRole("checkbox");
		const counter = screen.getByTestId("selected-messages-counter");

		checkboxes.forEach((checkbox) => {
			userEvent.click(checkbox);
			expect(checkbox).toBeChecked();
		});

		expect(counter).toHaveTextContent(mockMessages.length);
	});

	test("Should delete a selected message", async () => {
		render(<ChatControls />);

		const selectButton = screen.getByRole("listitem", { name: "select messages" });
		userEvent.click(selectButton);

		const checkboxes = await screen.findAllByRole("checkbox");
		const randomMessage = Math.floor(Math.random() * (mockMessages.length - 1));
		const randomMessageCheckbox = checkboxes[randomMessage];

		userEvent.click(randomMessageCheckbox);

		const deleteMessageButton = await screen.findByRole("button", {
			name: "delete messages button",
		});
		userEvent.click(deleteMessageButton);

		expect(
			screen.queryAllByRole("listitem", { name: "message" })[randomMessage]
		).not.toBeInTheDocument();
	});
}); */
