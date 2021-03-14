import "./Theme.css";

function Theme({ dispatch }) {
	return (
		<div className="theme-container" data-testid="theme">
			<div className="light-theme">
				<label htmlFor="light">Light Theme</label>
				<input type="radio" name="theme" id="light" defaultChecked />
			</div>
			<div className="dark-theme">
				<label htmlFor="dark">Dark Theme</label>
				<input type="radio" name="theme" id="dark" />
			</div>
			<div className="back-btn-container">
				<button className="back-btn" onClick={() => dispatch({ type: "RENDER_CHAT_INFO" })}>
					Back
				</button>
			</div>
		</div>
	);
}

export default Theme;
