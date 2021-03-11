import Menu from "../Menu/Menu";
import "./User.css";

function User({ user, dispatch }) {
	return (
		<div className="user-info" data-testid="user-info">
			<img src={user.avatar} alt="User Avatar" className="user-avatar" loading="lazy" />
			<div className="user-name">
				<span>{user.name}</span>
			</div>
			<div className="menu-container">
				<Menu>
					<ul className="menu" aria-label="settings">
						<li
							className="menu__item"
							aria-label="profile"
							onMouseDown={() => dispatch({ type: "RENDER_PROFILE_SETTINGS" })}
						>
							Profile
						</li>
						<li
							className="menu__item"
							aria-label="theme"
							onMouseDown={() => dispatch({ type: "RENDER_THEME_SETTINGS" })}
						>
							Change theme
						</li>
						<li
							className="menu__item"
							aria-label="background"
							onMouseDown={() => dispatch({ type: "RENDER_BACKGROUND_SETTINGS" })}
						>
							Change background
						</li>
					</ul>
				</Menu>
			</div>
		</div>
	);
}

export default User;
