import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Profile from "./Profile";

import { mockUser } from "../../test_utils/mockData";

describe("Profile component stand alone tests", () => {
	beforeEach(() => {
		render(<Profile user={mockUser} />);
	});

	test("Should render component's initial elements", () => {
		const avatar = screen.getByTestId("profile-image");
		const userName = screen.getByText(mockUser.name);
		const editNameButton = screen.getByRole("button", { name: "edit name button" });
		const changeProfileButton = screen.getByRole("button", { name: "change profile button" });

		expect(avatar).toBeInTheDocument();
		expect(avatar).toHaveStyle(`background:url(${mockUser.avatar})`);
		expect(userName).toBeInTheDocument();
		expect(editNameButton).toBeInTheDocument();
		expect(changeProfileButton).toBeInTheDocument();
		expect(changeProfileButton).toHaveTextContent("Back");

		expect(screen.getByRole("button", { name: "select avatar button" })).toBeInTheDocument();
		expect(screen.queryByTestId("name-settings")).not.toBeInTheDocument();
		expect(screen.queryByTestId("avatars")).not.toBeInTheDocument();
	});

	test("Should toggle change avatar button when user hovers on avatar image", () => {
		const avatar = screen.getByTestId("profile-image");

		userEvent.unhover(avatar);
		expect(screen.queryByRole("button", { name: "select avatar button" })).not.toBeInTheDocument();

		userEvent.hover(avatar);
		expect(screen.getByRole("button", { name: "select avatar button" })).toBeInTheDocument();
	});

	test("Should render avatars when user clicks on select avatar button", async () => {
		await waitFor(() => {
			userEvent.click(screen.getByRole("button", { name: "select avatar button" }));
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

		expect(screen.getByPlaceholderText(mockUser.name)).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "change name input" })).toBeRequired();
		expect(screen.getByRole("button", { name: "emoji button" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "change name button" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "emoji button" })).toBeInTheDocument();
	});

	test("Should toogle avatars and edit name elements", async () => {
		await waitFor(() => {
			userEvent.click(screen.getByRole("button", { name: "edit name button" }));
		});
		expect(screen.getByTestId("name-settings")).toBeInTheDocument();
		expect(screen.queryByTestId("avatars")).not.toBeInTheDocument();

		await waitFor(() => {
			userEvent.click(screen.getByRole("button", { name: "select avatar button" }));
		});
		expect(screen.getByTestId("avatars")).toBeInTheDocument();
		expect(screen.queryByTestId("name-settings")).not.toBeInTheDocument();
	});
});

describe("User changes profile", () => {
	test("Should change avatar", async () => {
		const dispatch = jest.fn();
		render(<Profile user={mockUser} dispatch={dispatch} />);
		await waitFor(() => {
			userEvent.click(screen.getByRole("button", { name: "select avatar button" }));
		});

		const avatars = await screen.findAllByAltText(/avatar/i);
		const randomAvatar = Math.floor(Math.random() * avatars.length);

		await waitFor(() => {
			userEvent.click(avatars[randomAvatar]);
		});
		expect(screen.getByRole("button", { name: "change profile button" })).toHaveTextContent(
			"Change"
		);
		expect(screen.getByTestId("profile-image")).toHaveStyle(
			`background: url(${avatars[randomAvatar].src})`
		);

		userEvent.click(screen.getByRole("button", { name: "change profile button" }));
		expect(dispatch).toHaveBeenCalled();
	});

	test("Should change name", async () => {
		const dispatch = jest.fn();
		render(<Profile user={mockUser} dispatch={dispatch} />);
		userEvent.click(screen.getByRole("button", { name: "edit name button" }));

		const changeNameInput = await screen.findByRole("textbox", { name: "change name input" });
		userEvent.type(changeNameInput, "");
		userEvent.click(screen.getByRole("button", { name: "change name button" }));
		expect(changeNameInput).toBeInvalid();

		userEvent.type(changeNameInput, "John Doe");
		userEvent.click(screen.getByRole("button", { name: "change name button" }));
		expect(screen.getByRole("button", { name: "change profile button" })).toHaveTextContent(
			"Change"
		);
		expect(screen.getByText("John Doe")).toBeInTheDocument();

		userEvent.click(screen.getByRole("button", { name: "change profile button" }));
		expect(dispatch).toHaveBeenCalled();
	});
});
