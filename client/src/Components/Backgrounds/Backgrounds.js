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

function Backgrounds() {
	return (
		<div className="backgrounds-container">
			{solidColorBackgrounds.map((background) => {
				return (
					<div
						className="background"
						style={{ backgroundColor: `${background.color}` }}
						title={background.name}
						value={background.color}
					></div>
				);
			})}
			<div className="back-btn-container">
				<button className="back-btn">Back</button>
			</div>
		</div>
	);
}

export default Backgrounds;
