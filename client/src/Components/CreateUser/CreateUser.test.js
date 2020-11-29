import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateUser from "./CreateUser";

describe("CreateUser tests", () => {
  test("Render user name section", () => {
    render(<CreateUser />);

    const welcomeTitle = screen.getByRole("heading", {
      name: /welcome/i,
      level: 1,
    });

    const nameLabel = screen.getByLabelText(/your name:/i);
    const nameInput = screen.getByRole("textbox");
    const createNameButton = screen.getByRole("button");

    expect(welcomeTitle).toBeInTheDocument();
    expect(nameLabel).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute("maxlength", 30);
    expect(nameInput).toBeRequired();
    expect(createNameButton).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-page")).not.toBeInTheDocument();
  });

  test("Create user name", () => {
    render(<CreateUser />);

    const nameInput = screen.getByRole("textbox");
    const createNameButton = screen.getByRole("button");

    userEvent.type(nameInput, "");
    userEvent.click(createNameButton);
    expect(nameInput).toBeInvalid();

    userEvent.type(nameInput, "very very very very long user name");
    userEvent.click(createNameButton);
    expect(nameInput).toBeInvalid();

    userEvent.type(nameInput, "John Doe");
    userEvent.click(createNameButton);
    expect(nameInput).toBeValid();
  });

  test("Render avatar section", () => {
    render(<CreateUser />);

    const avatarTitle = screen.getByRole("heading", {
      name: /pick an avatar/i,
      level: 1,
    });
    const avatarPreview = screen.getByAltText(/avatar preview/i);
    const avatarsCollection = screen.getAllByAltText(/avatar/i);

    expect(screen.queryByTestId("name-page")).not.toBeInTheDocument();

    expect(avatarTitle).toBeInTheDocument();
    expect(avatarPreview).toBeInTheDocument();
    expect(avatarPreview).toHaveAttribute("loading", "lazy");
    expect(avatarsCollection).toBeInTheDocument();
    expect(avatarsCollection).toHaveAttribute("loading", "lazy");
  });

  test("Select an avatar", async () => {
    render(<CreateUser />);

    const avatarPreview = screen.getByAltText(/avatar preview/i);
    const avatarsCollection = screen.getAllByAltText(/avatar/i);

    userEvent.click(avatarsCollection[0]);
    expect(avatarPreview.src).toEqual(avatarsCollection[0].src);

    const joinChatBtn = await screen.findByRole("button", {
      name: /join!/i,
    });
    expect(joinChatBtn).toBeInTheDocument();
  });
});
