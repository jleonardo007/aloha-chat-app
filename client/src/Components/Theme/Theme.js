import "./Theme.css";

function Theme() {
	return (
		<div className="theme-container">
			<div className="light-theme">
				<label htmlFor="light">Light Theme</label>
				<input type="radio" name="theme" id="light" checked />
			</div>
			<div className="dark-theme">
				<label htmlFor="dark">Dark Theme</label>
				<input type="radio" name="theme" id="dark" />
			</div>
			<div className="back-btn-container">
				<button className="back-btn">Back</button>
			</div>
		</div>
	);
}

export default Theme;
