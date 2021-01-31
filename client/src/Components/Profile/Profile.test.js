import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Profile from "./Profile";
import User from "../User/User";

import { mockUser } from "../../test_utils/mockData";

describe("Profile component stand alone tests", () => {
	beforeEach(() => {
		render(<Profile user={mockUser} />);
	});

	test("Should render component's initial elements", () => {
		const avatar = screen.getByRole("img", { name: "avatar" });
		const userName = screen.getByText(mockUser.name);
		const editNameButton = screen.getByRole("button", { name: "edit name button" });
		const changeProfileButton = screen.getByRole("button", { name: "change profile button" });

		expect(avatar).toBeInTheDocument();
		expect(avatar.src).toEqual(mockUser.avatar);
		expect(userName).toBeInTheDocument();
		expect(editNameButton).toBeInTheDocument();
		expect(changeProfileButton).toBeInTheDocument();
		expect(changeProfileButton).toHaveTextContent("Back");

		expect(screen.queryByRole("button", { name: "select avatar button" })).not.toBeInTheDocument();
		expect(screen.queryByTestId("name-settings")).not.toBeInTheDocument();
		expect(screen.queryByTestId("avatars")).not.toBeInTheDocument();
	});

	test("Should toggle change avatar button when user hovers on avatar image", () => {
		const avatar = screen.getByRole("img", { name: "avatar" });

		userEvent.hover(avatar);
		expect(screen.getByRole("button", { name: "select avatar button" })).toBeInTheDocument();

		userEvent.unhover(avatar);
		expect(screen.queryByRole("button", { name: "select avatar button" })).not.toBeInTheDocument();
	});

	test("Should render avatars when user clicks on select avatar button", async () => {
		const avatar = screen.getByRole("img", { name: "avatar" });
		userEvent.hover(avatar);

		const selectAvatarButton = screen.getByRole("button", { name: "select avatar button" });
		await waitFor(() => {
			userEvent.click(selectAvatarButton);
		});

		screen.getAllByAltText(/avatar/i).forEach((avatar) => {
			expect(avatar.src).toBeTruthy();
		});
	});

	test("Should render name edit elements when user clicks on change name button", async () => {
		const editNameButton = screen.getByRole("button", { name: "edit name button" });

		await waitFor(() => {
			userEvent.click(editNameButton);
		});
		expect(screen.getByRole("textbox", { name: "change name input" })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "change name input" })).toHaveTextContent(
			mockUser.name
		);
		expect(screen.getByRole("textbox", { name: "change name input" })).toBeRequired();
		expect(screen.getByRole("button", { name: "emoji button" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "change name button" })).toBeInTheDocument();

		const emojiButton = screen.getByRole("button", { name: "emoji button" });

		await waitFor(() => {
			userEvent.click(emojiButton);
		});
		expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();
	});

	test("Should toogle avatars and edit name elements", () => {
		userEvent.click(screen.getByRole("button", { name: "edit name button" }));
		expect(screen.getByTestId("name-settings")).toBeInTheDocument();
		expect(screen.queryByTestId("avatars")).not.toBeInTheDocument();

		userEvent.hover(screen.getByRole("img", { name: "avatar" }));
		userEvent.click(screen.getByRole("button", { name: "select avatar button" }));
		expect(screen.getByTestId("avatars")).toBeInTheDocument();
		expect(screen.queryByTestId("name-settings")).not.toBeInTheDocument();
	});
});

describe("User changes profile", () => {
	beforeEach(() => {
		render(<Profile user={mockUser} />);
		render(<User user={mockUser} />);
	});

	test("Should change avatar", async () => {
		userEvent.hover(screen.getByRole("img", { name: "avatar" }));
		userEvent.click(screen.getByRole("button", { name: "select avatar button" }));

		const avatars = await screen.findAllByAltText(/avatar/i);
		const randomAvatar = Math.floor(Math.random() * (avatars.length - 1));

		await waitFor(() => {
			userEvent.click(randomAvatar);
		});
		expect(screen.getByRole("button", { name: "change avatar button" })).toHaveTextContent(
			"Change"
		);
		expect(screen.getByRole("img", { name: "avatar" }).src).toEqual(avatars[randomAvatar].src);

		await waitFor(() => {
			userEvent.click(screen.getByRole("button", { name: "change avatar button" }));
		});
		expect(screen.getByAltText(/user avatar/i).src).toEqual(avatars[randomAvatar].src);
	});

	test("Should change name", async () => {
		const editNameButton = screen.getByRole("button", { name: "edit name button" });
		userEvent.click(editNameButton);

		const changeNameInput = await screen.findByRole("textbox", { name: "change name input" });
		userEvent.type(changeNameInput, "");
		userEvent.click(screen.getByRole("button", { name: "change name button" }));
		expect(changeNameInput).toBeInvalid();

		userEvent.type(changeNameInput, "John Doe");
		await waitFor(() => {
			userEvent.click(screen.getByRole("button", { name: "change name button" }));
		});
		expect(screen.getByRole("button", { name: "change avatar button" })).toHaveTextContent(
			"Change"
		);
		expect(screen.getAllByText("John Doe").length).toEqual(2);
	});
});
