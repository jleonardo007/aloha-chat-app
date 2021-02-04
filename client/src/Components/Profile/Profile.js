import Avatars from "../Avatars/Avatars";
import NameSettings from "../NameSettings/NameSettings";
import { BsPencil } from "react-icons/bs";

import "./Profile.css";

function Profile({ user }) {
	return (
		<>
			<div className="profile-container">
				<div className="profile-image">
					<img src={user.avatar} alt={user.name} />
				</div>
				<div className="profile-name">
					<span>{user.name}</span>
					<button className="edit-name-btn">
						<BsPencil />
					</button>
				</div>
				<div className="change-profile">
					<button className="change-profile-btn">{!true ? "Change" : "Back"}</button>
				</div>
			</div>
			<div className="settings-container">
				{!true ? null : true ? <Avatars /> : <NameSettings name={user.name} />}
			</div>
		</>
	);
}

export default Profile;
