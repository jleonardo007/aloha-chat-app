import { screen, render } from "@testing-library/react";

import User from "./User";

import { mockUser } from "../../test_utils/mockData";

describe("User component stand alone test", () => {
	render(<User user={mockUser} />);

	test("User info are showed", () => {
		const userInfo = screen.getByTestId("user-info");

		expect(userInfo).toContainElement(screen.getByAltText(/user avatar/i));
		expect(userInfo).toContainElement(screen.getByText(mockUser.name));
	});
});
