import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

function Menu({ children }) {
  const [toogleMenu, setToggleMenu] = useState(false);

  return (
    <>
      <FontAwesomeIcon
        icon={faEllipsisV}
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
