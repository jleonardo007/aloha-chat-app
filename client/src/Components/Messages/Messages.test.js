import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Messages from "./Messages";

import testSocket from "../../test_utils/testSocket";

describe("Messages component stand alone tests", () => {
	beforeEach(() => {
		render(
			<Messages
				background={{
					color: "#013220",
					toggleColor: "",
				}}
			/>
		);
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

		playButtons.forEach(async (playButton, index) => {
			userEvent.click(playButton);
			expect(
				screen.getAllByRole("button", { name: "play voice note" })[index]
			).not.toBeInTheDocument();
			const pauseButton = await screen.findAllByRole("button", { name: "pause voice note" });
			expect(pauseButton[index]).toBeInTheDocument();

			userEvent.click(playButton[index]);
			expect(
				screen.getAllByRole("button", { name: "pause voice note" })[index]
			).not.toBeInTheDocument();
			expect(screen.getAllByRole("button", { name: "play voice note" })[index]).toBeInTheDocument();
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
