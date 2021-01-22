import audioSample from "./audio_sample.mp3";
import userAvatar1 from "../default-avatars/astronauta.png";
import userAvatar2 from "../default-avatars/nina-2.png";

const messages = [
	{
		type: "text",
		status: "send",
		content: "Hello world!!",
		user: {
			name: "John Doe",
			avatar: userAvatar1,
		},
	},
	{
		type: "text",
		status: "received",
		content: "whats uuuuup!",
		user: {
			name: "Jane Doe",
			avatar: userAvatar2,
		},
	},
	{
		type: "text",
		status: "received",
		content: "btw i use arch linux",
		user: {
			name: "Jane Doe",
			avatar: userAvatar2,
		},
	},
	{
		type: "text",
		status: "send",
		content: "me tooo!",
		user: {
			name: "John Doe",
			avatar: userAvatar1,
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
			name: "Jane Doe",
			avatar: userAvatar2,
		},
	},
	{
		type: "voice-note",
		status: "send",
		content: audioSample,
		user: {
			name: "Jonh Doe",
			avatar: userAvatar1,
		},
	},
	{
		type: "voice-note",
		status: "received",
		content: audioSample,
		user: {
			name: "Jane Doe",
			avatar: userAvatar2,
		},
	},
];

export default messages;
