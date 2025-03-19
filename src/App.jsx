import {
	APIProvider,
	Map as GoogleMap,
	RenderingType,
} from "@vis.gl/react-google-maps";
import React from "react";
import {
	Redirect,
	Route,
	BrowserRouter as Router,
	Switch,
} from "react-router-dom";
import "./App.css";
import Deckgl from "./deckgl/Deckgl";
import Markers from "./markers/Markers";

function App() {
	return (
		<div className="map-container">
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
					<Router>
						<Switch>
							<Route exact component={Deckgl} path="/deckgl" />
							<Route exact component={Markers} path="/markers" />
							<Redirect to="/deckgl" />
						</Switch>
					</Router>
				</GoogleMap>
			</APIProvider>
		</div>
	);
}

export default App;
