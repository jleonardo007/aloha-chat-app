import { screen, render } from "@testing-library/react";

import ChatPanel from "./ChatPanel";
import userAvatar1 from "../../default-avatars/astronauta.png";

const mockUser = {
	name: "Black Mamba",
	avatar: userAvatar1,
};

describe("ChatPanel's stand alone tests", () => {
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
