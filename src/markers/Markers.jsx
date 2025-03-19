import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import trees from "../data/mockedTrees.json";

function CustomOverlay(map) {
	this.map = map;
	this.div = null;
	this.setMap(map);
}

CustomOverlay.prototype = new window.google.maps.OverlayView();

CustomOverlay.prototype.onAdd = function () {
	const div = document.createElement("div");
	div.style.borderStyle = "solid";
	div.style.borderWidth = "2px";
	div.style.borderColor = "red";
	div.style.position = "absolute";
	this.div = div;

	const panes = this.getPanes();
	panes.overlayLayer.appendChild(div);
};

CustomOverlay.prototype.draw = function () {
	const overlayProjection = this.getProjection();
	const sw = overlayProjection.fromLatLngToDivPixel(
		new window.google.maps.LatLng(-33.718234, 150.363181),
	);
	const ne = overlayProjection.fromLatLngToDivPixel(
		new window.google.maps.LatLng(-31.56391, 147.154312),
	);

	const div = this.div;
	div.style.left = `${sw.x}px`;
	div.style.top = `${ne.y}px`;
	div.style.width = `${ne.x - sw.x}px`;
	div.style.height = `${sw.y - ne.y}px`;
};

CustomOverlay.prototype.onRemove = function () {
	this.div.parentNode.removeChild(this.div);
	this.div = null;
};

const Markers = () => {
	let cluster;
	const map = useMap();
	let mapMarkers = [];

	useEffect(() => {
		// With API
		if (window && trees.length && map) {
			mapMarkers = trees.map(
				(tree) =>
					new window.google.maps.marker.AdvancedMarkerElement({
						position: tree.position,
						zIndex: 10,
					}),
			);

			cluster = new MarkerClusterer({
				map,
				markers: mapMarkers,
				options: {
					imagePath:
						"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
				},
			});
		}
	}, [trees, window, map]);

	return <></>;
};

export default Markers;
