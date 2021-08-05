import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Backgrounds from "../Backgrounds/Backgrounds";

describe("Backgrounds component standalone test", () => {
	test("Should render color options", () => {
		render(<Backgrounds />);
		expect(screen.getAllByTestId("color-options").length).toEqual(9);
	});
});

describe("User changes chat background", () => {
	test("Should toogle background color on hover", () => {
		const setBackground = jest.fn();
		render(
			<Backgrounds
				backgroundColor={{
					color: "#013220",
					toggleColor: "",
				}}
				setBackground={setBackground}
			/>
		);

		const backgrounds = screen.getAllByTestId("color-options");
		const randomBackground = Math.floor(Math.random() * (backgrounds.length - 1));

		userEvent.hover(backgrounds[randomBackground]);
		expect(setBackground).toHaveBeenCalled();

		userEvent.unhover(backgrounds[randomBackground]);
		expect(setBackground).toHaveBeenCalled();
	});

	test("Should select background on click color", () => {
		const setBackground = jest.fn();
		render(
			<Backgrounds
				backgroundColor={{
					color: "#013220",
					toggleColor: "",
				}}
				setBackground={setBackground}
			/>
		);

		const backgrounds = screen.getAllByTestId("color-options");
		const randomBackground = Math.floor(Math.random() * (backgrounds.length - 1));

		userEvent.click(backgrounds[randomBackground]);
		expect(setBackground).toHaveBeenCalled();
	});
});
