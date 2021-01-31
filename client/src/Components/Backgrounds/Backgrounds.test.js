import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Backgrounds from "../Backgrounds/Backgrounds";
import Messages from "../Messages/Messages";

describe("Backgrounds component standalone test", () => {
	test("Should render color options", () => {
		render(<Backgrounds />);
		expect(screen.getAllByTestId("color-options").length).toEqual(9);
	});
});

describe("User changes chat background", () => {
	beforeEach(() => {
		render(<Backgrounds />);
		render(<Messages messages={[]} />);
	});

	test("Should change background on hover", () => {
		const backgrounds = screen.getAllByTestId("color-options");
		const randomBackground = Math.floor(Math.random() * (backgrounds.length - 1));

		userEvent.hover(backgrounds[randomBackground]);

		expect(screen.getByRole("list", { name: "messages" })).toHaveStyle({ backgruoundColor: "red" });
	});

	test("Should select background on click color", () => {
		const backgrounds = screen.getAllByTestId("color-options");
		const randomBackground = Math.floor(Math.random() * (backgrounds.length - 1));

		userEvent.click(backgrounds[randomBackground]);

		expect(screen.getByRole("list", { name: "messages" })).toHaveStyle({ backgruoundColor: "red" });
	});
});
