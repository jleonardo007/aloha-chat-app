import { render, screen } from "@testing-library/react";
import App from "./App";

test("Check if tests works", () => {
  render(<App />);
  const element = screen.getByText(/initial config/i);
  expect(element).toBeInTheDocument();
});
