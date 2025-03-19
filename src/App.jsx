import {
	APIProvider,
	Map as GoogleMap,
	RenderingType,
} from "@vis.gl/react-google-maps";
import React, { useState } from "react";
import "./App.css";
import { ICON_IMAGES } from "./const";
import Deckgl from "./deckgl/Deckgl";

function App() {
	const [filters, setFilters] = useState(Object.keys(ICON_IMAGES));

	const onFilterClick = (e) => {
		const { value } = e.target;
		if (filters.includes(value)) {
			setFilters(filters.filter((filter) => filter !== value));
		} else {
			setFilters([...filters, value]);
		}
	};

	return (
		<div className="map-container">
			<div
				style={{
					position: "absolute",
					padding: "12px 20px 12px 20px",
					top: 0,
					left: 0,
					height: "auto",
					width: 150,
					zIndex: 100,
					backgroundColor: "rgba(255, 255, 255, 0.8)",
					borderRadius: 5,
				}}
			>
				<h2>Filters</h2>
				{Object.keys(ICON_IMAGES).map((key) => (
					<div key={key} style={{ marginBottom: 4 }}>
						<input
							style={{ cursor: "pointer" }}
							type="checkbox"
							id={key}
							name={key}
							value={key}
							checked={filters.includes(key)}
							onChange={onFilterClick}
						/>
						<label htmlFor={key}>{key}</label>
					</div>
				))}
				<div
					style={{
						marginTop: 14,
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<button
						style={{
							margin: 10,
							padding: 6,
							borderRadius: 6,
							cursor: "pointer",
						}}
						type="button"
						onClick={() => setFilters(Object.keys(ICON_IMAGES))}
						disabled={filters.length === Object.keys(ICON_IMAGES).length}
					>
						Select all
					</button>
					<button
						style={{
							margin: 10,
							padding: 6,
							borderRadius: 6,
							cursor: "pointer",
						}}
						type="button"
						onClick={() => setFilters([])}
						disabled={filters.length === 0}
					>
						Clear all
					</button>
				</div>
			</div>
			<APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
				<GoogleMap
					mapId={process.env.REACT_APP_GOOGLE_MAP_ID}
					defaultCenter={{ lat: 53.915, lng: -3 }}
					defaultZoom={7.5}
					minZoom={6}
					gestureHandling={"greedy"}
					renderingType={RenderingType.VECTOR}
					disableDefaultUI
				>
					<Deckgl filters={filters} />
					{/* <Router>
						<Switch>
							<Route
								exact
								component={() => <Deckgl filters={filters} />}
								path="/"
							/>
							<Route exact component={Markers} path="/markers" />
						</Switch>
					</Router> */}
				</GoogleMap>
			</APIProvider>
		</div>
	);
}

export default App;
