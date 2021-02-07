import { useState } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import "./Menu.css";

function Menu({ children }) {
	const [toogleMenu, setToggleMenu] = useState(false);

	return (
		<>
			{toogleMenu ? (
				<AiOutlineClose className="menu-icon" onClick={() => setToggleMenu(!toogleMenu)} />
			) : (
				<BsThreeDotsVertical className="menu-icon" onClick={() => setToggleMenu(!toogleMenu)} />
			)}

			{toogleMenu ? children : null}
		</>
	);
}

export default Menu;
