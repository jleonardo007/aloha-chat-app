import { BsThreeDotsVertical } from "react-icons/bs";
import "./Menu.css";

function Menu({ children }) {
	return (
		<>
			<BsThreeDotsVertical className="menu-icon" tabIndex={1} />
			{children}
		</>
	);
}

export default Menu;
