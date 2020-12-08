import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateUser from "./CreateUser";

test("User is created", async () => {
   const joinChat = jest.fn();
   render(<CreateUser joinChat={joinChat} />);

   const welcomeTitle = screen.getByRole("heading", {
      name: /welcome/i,
      level: 1,
   });
   const nameLabel = screen.getByText(/your name:/i);
   const nameInput = screen.getByRole("textbox");
   const createNameButton = screen.getByRole("button", { name: /next/i });

   expect(welcomeTitle).toBeInTheDocument();
   expect(nameLabel).toBeInTheDocument();
   expect(nameInput).toBeInTheDocument();
   expect(nameInput).toHaveAttribute("maxlength", "30");
   expect(nameInput).toBeRequired();
   expect(createNameButton).toBeInTheDocument();

   userEvent.type(nameInput, "");
   userEvent.click(createNameButton);
   expect(nameInput).toBeInvalid();

   userEvent.type(nameInput, "John Doe");
   userEvent.click(createNameButton);
   expect(nameInput).toBeValid();

   await waitFor(() => {
      expect(screen.queryByTestId("username-page")).not.toBeInTheDocument();
   });

   const avatarTitle = await screen.findByRole("heading", {
      name: /pick an avatar!/i,
      level: 1,
   });
   const avatarPreview = await screen.findByAltText(/avatar preview/i);
   const avatarsCollection = await screen.findAllByAltText(/user avatar/i);
   const randomAvatar = Math.floor(Math.random() * 9);

   expect(avatarTitle).toBeInTheDocument();
   expect(avatarPreview).toBeInTheDocument();
   expect(avatarPreview).toHaveAttribute("loading", "lazy");
   expect(avatarsCollection[randomAvatar]).toBeInTheDocument();
   expect(avatarsCollection[randomAvatar]).toHaveAttribute("loading", "lazy");

   expect(
      screen.queryByRole("button", {
         name: /join!/i,
      })
   ).not.toBeInTheDocument();

   userEvent.click(avatarsCollection[randomAvatar]);

   expect(avatarPreview.src).toEqual(avatarsCollection[randomAvatar].src);

   const joinChatBtn = await screen.findByRole("button", {
      name: /join!/i,
   });

   expect(joinChatBtn).toBeInTheDocument();
   userEvent.click(joinChatBtn);
   expect(joinChat).toHaveBeenCalledTimes(1);
});
