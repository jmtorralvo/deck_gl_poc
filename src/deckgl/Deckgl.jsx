import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { IconLayer } from "@deck.gl/layers";
import { useMap } from "@vis.gl/react-google-maps";
import React, { useEffect, useMemo, useState } from "react";
import { ICON_IMAGES } from "../const";
// import IconClusterLayer from "./IconClustererLayer";
// import iconAtlas from "./data/location-icon-atlas.png";
// import trees from "../data/mockedTrees.json";
import audits from "../data/data.json";

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

	// overlay.setProps(props);
	return null;
};

const filterItems = ({ items, filters }) => {
	return items.filter((item) => filters.includes(item.category));
};

const Deckgl = ({ filters }) => {
	const [hoverInfo, setHoverInfo] = useState();
	const [dataFiltered, setDataFiltered] = useState(
		filterItems({ items: audits, filters }),
	);

	const layers = [
		// new ScatterplotLayer({
		// 	id: "deckgl-circle",
		// 	data: trees,
		// 	getPosition: (d) => [d.position.lng, d.position.lat, 0],
		// 	//getFillColor: [255, 0, 255, 140],
		// 	// getRadius: 1,
		// 	//radiusScale: 100,
		// 	// radiusMinPixels: 1,
		// 	// radiusMaxPixels: 1,
		// 	pickable: true,
		// 	// onHover: (info) => {
		// 	// 	console.log("info", info);
		// 	// 	setHoverInfo(info);
		// 	// },
		// }),
		new IconLayer({
			id: "deckgl-icon",
			data: dataFiltered,
			getColor: [255, 0, 255, 255],
			sizeUnits: "common",
			sizeMaxPixels: 40,
			sizeMinPixels: 4,
			getIcon: (d) => ({
				url: ICON_IMAGES[d.category],
				//url: iconImagesArr[Math.floor(Math.random() * iconImagesArr.length)],
				width: 40,
				height: 40,
				anchorY: 40,
			}),
			getPosition: (d) => [
				d.audit_start_coordinates.lng,
				d.audit_start_coordinates.lat,
				0,
			],
			pickable: true,
			onClick: (info) => {
				console.log("info", info);
				setHoverInfo(info);
			},
		}),
	];

	return (
		<>
			<div
				style={{
					position: "absolute",
					height: 100,
					width: 300,
					top: 0,
					right: 20,
					zIndex: 100,
				}}
			>
				<h2>DeckGL POC</h2>
				<p>Amount of elements displayed: {audits.length}</p>
			</div>
			{hoverInfo?.object && (
				<div
					style={{
						position: "absolute",
						top: "75vh",
						left: 20,
						zIndex: 100,
					}}
				>
					<h2>Item Id:</h2>
					<p>{hoverInfo.object.title}</p>
					<p>{hoverInfo.object.area}</p>
					<p>{hoverInfo.object.id}</p>
				</div>
			)}
			<DeckGLOverlay layers={layers} />
		</>
	);
};

export default Deckgl;
