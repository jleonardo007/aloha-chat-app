import "./Backgrounds.css";

const solidColorBackgrounds = [
	{
		name: "coquelicot",
		color: "#FF3800",
	},
	{
		name: "amazon",
		color: "#3B7A57",
	},
	{
		name: "amber",
		color: "#FFBF00",
	},
	{
		name: "american rose",
		color: "#FF033E",
	},
	{
		name: "air force dark blue",
		color: "#00308F",
	},
	{
		name: "black",
		color: "#000000",
	},
	{
		name: "bright pink",
		color: "#FF007F",
	},
	{
		name: "byzantium",
		color: "#702963",
	},
	{
		name: "dark green",
		color: "#013220",
	},
];

function Backgrounds({ dispatch, chatConfigObject, setChatConfigObject }) {
	function handleBackgroundChange(e) {
		setChatConfigObject({
			...chatConfigObject,
			backgroundColor: e.target.getAttribute("data-color-value"),
			toggleBackgroundColor: "",
		});
	}

	function handleSelectBackground(e) {
		if (e.type === "mouseenter")
			setChatConfigObject({
				...chatConfigObject,
				toggleBackgroundColor: e.target.getAttribute("data-color-value"),
			});
		else if (e.type === "mouseleave")
			setChatConfigObject({
				...chatConfigObject,
				toggleBackgroundColor: "",
			});
		else
			setChatConfigObject({
				...chatConfigObject,
			});
	}

	return (
		<div className="backgrounds-container" data-testid="backgrounds">
			{solidColorBackgrounds.map((background, index) => {
				return (
					<div
						className="background"
						data-testid="color-options"
						style={{ backgroundColor: background.color }}
						title={background.name}
						data-color-value={background.color}
						key={index}
						onClick={(e) => handleBackgroundChange(e)}
						onMouseEnter={(e) => handleSelectBackground(e)}
						onMouseLeave={(e) => handleSelectBackground(e)}
					></div>
				);
			})}
			<div className="back-btn-container">
				<button className="back-btn" onClick={() => dispatch({ type: "RENDER_CHAT_INFO" })}>
					Back
				</button>
			</div>
		</div>
	);
}

export default Backgrounds;
