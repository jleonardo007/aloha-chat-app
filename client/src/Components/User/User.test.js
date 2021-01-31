import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import User from "./User";
import ChatInfo from "../ChatInfo/ChatInfo";

import { mockUser } from "../../test_utils/mockData";

describe("User component stand alone test", () => {
	render(<User user={mockUser} />);

	test("User info are showed", () => {
		const userInfo = screen.getByTestId("user-info");

		expect(userInfo).toContainElement(screen.getByAltText(/user avatar/i));
		expect(userInfo).toContainElement(screen.getByText(mockUser.name));
	});
});

describe("When user clicks on settings menu", () => {
	beforeEach(() => {
		render(<User user={mockUser} />);
	});

	test("Should render profile when click on it", async () => {
		const profile = screen.getByRole("listitem", { name: "profile" });

		await waitFor(() => {
			userEvent.click(profile);
		});
		render(<ChatInfo user={mockUser} />);

		const profileComponent = await screen.findByTestId("profile");
		expect(profileComponent).toBeInTheDocument();
		expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
	});

	test("Should render background options when click on it", async () => {
		const background = screen.getByRole("listitem", { name: "background" });

		await waitFor(() => {
			userEvent.click(background);
		});
		render(<ChatInfo user={mockUser} />);

		const backgroundComponent = await screen.findByTestId("background");
		expect(backgroundComponent).toBeInTheDocument();
		expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
	});

	test("Should render theme options when click on it", async () => {
		const theme = screen.getByRole("listitem", { name: "theme" });

		await waitFor(() => {
			userEvent.click(theme);
		});
		render(<ChatInfo user={mockUser} />);

		const themeComponent = await screen.findByTestId("theme");
		expect(themeComponent).toBeInTheDocument();
		expect(screen.queryByTestId("chat-info")).not.toBeInTheDocument();
	});
});
