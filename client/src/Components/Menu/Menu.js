import { useState } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";

import "./Menu.css";

function Menu({ children }) {
  const [toogleMenu, setToggleMenu] = useState(false);

  return (
    <>
      <BsThreeDotsVertical
        tabIndex="0"
        className="menu-icon"
        data-testid="menu"
        onFocus={() => setToggleMenu(true)}
        onBlur={() => setToggleMenu(false)}
      />

      {toogleMenu && children}
    </>
  );
}

export default Menu;
