import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Messages from "./Messages";

import testSocket from "../../test_utils/testSocket";
import mockMessages from "../../test_utils/mockMessages";

describe("Messages component stand alone tests", () => {
	beforeEach(() => {
		render(<Messages messages={mockMessages} />);
	});

	test("Should render text message and audio message", () => {
		const textMessages = screen.getAllByTestId("text-message-content");
		const voiceNotes = screen.getAllByTestId("voice-note");

		textMessages.forEach((message) => {
			expect(message).toBeInTheDocument();
		});

		voiceNotes.forEach((note) => {
			expect(note).toBeInTheDocument();
		});
	});

	test("Should play a voice note", () => {
		const playButtons = screen.getAllByRole("button", { name: "play voice note" });

		playButtons.forEach((playButton, index) => {
			userEvent.click(playButton);
			expect(screen.queryAllByTestId("play")[index]).not.toBeInTheDocument();
			expect(screen.getAllByTestId("pause")[index]).toBeInTheDocument();

			userEvent.click(playButton);
			expect(screen.queryAllByTestId("pause")[index]).not.toBeInTheDocument();
			expect(screen.getAllByTestId("play")[index]).toBeInTheDocument();
		});
	});

	test("Should show when a friend has seen a message", () => {
		const statusLabels = screen.getAllByTestId("message status");

		act(() => {
			testSocket.emit("test:seen-messages");
		});

		statusLabels.forEach((label) => {
			expect(label).toHaveClass("seen-status-color");
		});
	});
});
