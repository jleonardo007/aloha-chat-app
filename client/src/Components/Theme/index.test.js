import { screen, render } from "@testing-library/react";

import Theme from "./Theme";

describe("Theme component stand alone test", () => {
	test("Should render dark mode an light mode radio buttons", () => {
		render(<Theme />);
		expect(screen.getByRole("radio", { name: "light mode" })).toBeInTheDocument();
		expect(screen.getByRole("radio", { name: "dark mode" })).toBeInTheDocument();
	});
});
