import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const DeckGLOverlay = (props) => {
	const map = useMap();

	useEffect(() => {
		const overlay = new GoogleMapsOverlay({
			...props,
		});
		overlay.setMap(map);
		return () => overlay.setMap(null);
	}, [map, props]);

	return null;
};

export default DeckGLOverlay;
