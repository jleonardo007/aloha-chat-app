import astronauta from "../../default-avatars/astronauta.png";
import hacker from "../../default-avatars/hacker.png";
import niña1 from "../../default-avatars/nina-1.png";
import niña2 from "../../default-avatars/nina-2.png";
import niña3 from "../../default-avatars/nina-3.png";
import niña4 from "../../default-avatars/nina-4.png";
import ninja from "../../default-avatars/ninja.png";
import rey from "../../default-avatars/rey.png";

import "./Avatars.css";

const avatarsCollection = [astronauta, hacker, niña1, niña2, niña3, niña4, ninja, rey];

function Avatars() {
	return (
		<div className="avatars-collection">
			{avatarsCollection.map((avatarSrc, index) => {
				return (
					<img
						key={index}
						src={avatarSrc}
						alt="User avatar"
						loading="lazy"
						onClick={(e) => {
							//setAvatar(e.target.src);
						}}
					/>
				);
			})}
		</div>
	);
}

export default Avatars;
