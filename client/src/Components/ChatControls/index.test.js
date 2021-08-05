import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChatControls from "./ChatControls";

describe("ChatControls component stand alone test", () => {
	beforeEach(() => {
		render(<ChatControls />);
	});

	/* 	test("Should show emoji picker when user clicks on emoji button", async () => {
		const emojiButton = screen.getByRole("button", { name: "emoji button" });
		userEvent.click(emojiButton);

		const emojiPicker = await screen.findByTestId("emoji-picker");
		expect(emojiPicker).toBeInTheDocument();
	});
 */

	/* 	test("Should change microfone icon when user types", () => {
		const messageBox = screen.getByRole("textbox", { name: "message input" });

		userEvent.type(messageBox, "Hello world!!");
		expect(screen.queryByRole("button", { name: "voice note button" })).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "send message button" })).toBeInTheDocument();

		messageBox.setSelectionRange(0, 13);
		userEvent.type(messageBox, "{backspace}");
		expect(screen.queryByRole("button", { name: "send message button" })).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "voice note button" })).toBeInTheDocument();
	}); */

	test("Should show recording icon when user starts a voice note", async () => {
		const voiceNoteButton = screen.getByRole("button", { name: "voice note button" });
		userEvent.click(voiceNoteButton);

		const recordingIcon = await screen.findByTestId("animated-mic");
		expect(recordingIcon).toBeInTheDocument();
	});

	test("Should show cancel dialog when user starts recording voice note", async () => {
		const voiceNoteButton = screen.getByRole("button", { name: "voice note button" });
		userEvent.click(voiceNoteButton);

		const cancelDialog = await screen.findByText(/swipe to cancel/i);
		expect(cancelDialog).toBeInTheDocument();
	});
});
