import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo } from "react";

const DeckGLOverlay = (props) => {
	const map = useMap();
	const overlay = useMemo(
		() =>
			new GoogleMapsOverlay({
				...props,
			}),
	);

	useEffect(() => {
		overlay.setMap(map);
		return () => overlay.setMap(null);
	}, [map]);

	return null;
};

export default DeckGLOverlay;
