import { useState } from "react";

import CreateUser from "./Components/CreateUser/CreateUser";
import ChatPanel from "./Components/ChatPanel/ChatPanel";

function App() {
   const [userDidCreated, setUserState] = useState(false);
   const [user, setUser] = useState({});

   const joinChat = (name, avatar) => {
      setUser({
         name,
         avatar,
      });

      setUserState(!userDidCreated);
   };

   return userDidCreated ? (
      <ChatPanel user={user} />
   ) : (
      <CreateUser joinChat={joinChat} />
   );
}

export default App;
