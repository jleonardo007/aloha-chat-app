import { BiCheckDouble } from "react-icons/bi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import "./Messages.css";

import audioSample from "../../test_utils/audio_sample.mp3";
import userAvatar from "../../default-avatars/rey.png";

function TextMessages({ status, content }) {
	return (
		<p className={`${status === "send" ? "message-send" : "message-received"}`}>
			{content}
			<span className="message-status-label">
				<BiCheckDouble className={!true ? "seen-status-color" : null} />
			</span>
		</p>
	);
}

function VoiceNote({ user, message }) {
	return (
		<div
			className={`voice-note-container ${
				message.status === "send" ? "message-send" : "message-received"
			}`}
		>
			<div className={`${message.status === "send" ? "voice-note-send " : "voice-note-received "}`}>
				<img src={user.avatar} alt={user.name} className="user-avatar" />
				<div className="voice-note">
					<span>
						{true ? <BsPlayFill className="play-btn" /> : <BsPauseFill className="pause-btn" />}
					</span>
					<div className="audio-progress-bar">
						<div className="progress-bar-indicator"></div>
					</div>
					<audio src={message.content}></audio>
				</div>
			</div>
			<p className="voice-note-status">
				<span className="voice-note-duration">0:50</span>
				<span className="message-status-label">
					<BiCheckDouble className={!true ? "seen-status-color" : null} />
				</span>
			</p>
		</div>
	);
}

function Messages(/*{ messages }*/) {
	const messages = [
		{
			type: "text",
			status: "send",
			content: "Hello world!!",
			user: {
				name: "",
				avatar: "",
			},
		},
		{
			type: "text",
			status: "received",
			content: "whats uuuuup!",
			user: {
				name: "",
				avatar: "",
			},
		},
		{
			type: "text",
			status: "received",
			content: "btw i use arch linux",
			user: {
				name: "",
				avatar: "",
			},
		},
		{
			type: "text",
			status: "send",
			content: "me tooo!",
			user: {
				name: "",
				avatar: "",
			},
		},
		{
			type: "text",
			status: "received",
			content: `
				We use command-line utilities every day, whether it be git, grep, awk, npm, or any other terminal app. CLIs are super useful and usually the fastest way to get something done. Do you have something in your specific workflow that you have to do over and over again? Chances are that can be automated with a CLI.

				We are going to use Node.js to make our CLI if it wasn’t clear from the title itself. Why? Because the Node.js ecosystem has thousands of extremely useful packages that we can utilize to achieve what we are trying to do. Whatever it may be that you are trying to do, it is highly probable that there exists a package for it on npm, also node has built-in libraries to do a lot of things like handling files, launching other applications, asserting tests, etc. Apart from that CLIs built in Node.js
				are highly portable, meaning they are easy to install on different OSs.
			
				For the purpose of this tutorial, we’ll be building a simple CLI to translate between languages. We’ll accept string type arguments, parse them into a sentence, shoot them off to a translation API which will fetch us the translations, and then display the result. The complete code for this can be found on the Github repository. Let’s dive right into it!`,
			user: {
				name: "",
				avatar: "",
			},
		},
		{
			type: "voice-note",
			status: "send",
			content: audioSample,
			user: {
				name: "Jonh Doe",
				avatar: userAvatar,
			},
		},
		{
			type: "voice-note",
			status: "received",
			content: audioSample,
			user: {
				name: "Jonh Doe",
				avatar: userAvatar,
			},
		},
	];

	return (
		<ul className="messages">
			{messages.map((message, index) => {
				return (
					<li className="message" key={index}>
						{!true ? <input type="checkbox" className="select-box" /> : null}

						{message.type === "text" ? (
							<TextMessages status={message.status} content={message.content} />
						) : message.type === "voice-note" ? (
							<VoiceNote user={message.user} message={message} />
						) : (
							<p> Invalid message content. </p>
						)}
					</li>
				);
			})}
		</ul>
	);
}

export default Messages;
