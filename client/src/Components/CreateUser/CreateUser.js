import { useState } from "react";

import "./CreateUser.css";

import astronauta from "../../default-avatars/astronauta.png";
import hacker from "../../default-avatars/hacker.png";
import niña1 from "../../default-avatars/nina-1.png";
import niña2 from "../../default-avatars/nina-2.png";
import niña3 from "../../default-avatars/nina-3.png";
import niña4 from "../../default-avatars/nina-4.png";
import ninja from "../../default-avatars/ninja.png";
import rey from "../../default-avatars/rey.png";
import noAvatar from "../../default-avatars/no-avatar.png";
import heroImage from "../../chat-icons/hero-image.jpg";

const avatarsCollection = [astronauta, hacker, niña1, niña2, niña3, niña4, ninja, rey];

function CreateUserName({ setUserName }) {
	const [inputValue, setInputValue] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		setUserName(inputValue);
	};

	return (
		<section className="welcome-page" data-testid="username-page">
			<div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }}></div>
			<div className="welcome__container">
				<div className="welcome__title">
					<h1>Make new friends, just say</h1>
					<h2 className="app-title">Aloha!</h2>
				</div>
				<div className="create-name-container">
					<form className="form" onSubmit={(e) => handleSubmit(e)}>
						<div className="form-label">
							<label htmlFor="user-name">Your name:</label>
						</div>
						<div className="form-input">
							<input
								type="text"
								required
								maxLength={30}
								id="user-name"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
							/>
						</div>
						<div className="form-btn">
							<button type="submit">Next</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}

function CreateUserAvatar({ avatar, setAvatar, handleClick }) {
	return (
		<section className="avatar-page" data-testid="avatar-page">
			<div className="avatar__title">
				<h1>Pick an avatar!</h1>
			</div>
			<div className="avatar__container">
				<div className="avatar__preview">
					<img
						src={avatar ? avatar : noAvatar}
						className="avatar-image"
						alt="Avatar preview"
						loading="lazy"
					/>
					<div className="join-btn-container">
						{avatar ? <button onClick={() => handleClick()}>Join!</button> : null}
					</div>
				</div>
				<div className="default-avatars">
					<div className="collection">
						{avatarsCollection.map((avatarSrc, index) => {
							return (
								<img
									key={index}
									src={avatarSrc}
									alt="User avatar"
									className="avatar-image"
									loading="lazy"
									onClick={(e) => {
										setAvatar(e.target.src);
									}}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}

function CreateUser({ dispatch }) {
	const [userName, setUserName] = useState("");
	const [userAvatar, setAvatar] = useState("");

	const handleClick = () => {
		dispatch({
			type: "CREATE_USER",
			userName,
			userAvatar,
		});
	};

	return !userName ? (
		<CreateUserName setUserName={setUserName} />
	) : (
		<CreateUserAvatar avatar={userAvatar} setAvatar={setAvatar} handleClick={handleClick} />
	);
}

export default CreateUser;
