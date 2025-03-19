import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { IconLayer } from "@deck.gl/layers";
import { useMap } from "@vis.gl/react-google-maps";
import React, { useEffect, useMemo, useState } from "react";
// import IconClusterLayer from "./IconClustererLayer";
// import iconAtlas from "./data/location-icon-atlas.png";
// import trees from "../data/mockedTrees.json";
import audits from "../data/audit_mock_2.json";

const tooltipStyle = {
	position: "absolute",
	pointerEvents: "none",
	height: 140,
	width: 100,
	backgroundColor: "rgba(255, 255, 255, 0.7);",
	zIndex: 100,
};

const iconImages = {
	tree: "https://img.icons8.com/?size=40&id=ALNT1kCnEvgU&format=png",
	bush: "https://img.icons8.com/?size=40&id=21806&format=png",
	flower: "https://img.icons8.com/?size=40&id=58781&format=png",
	grass: "https://img.icons8.com/?size=40&id=58784&format=png",
	weed: "https://img.icons8.com/?size=40&id=21046&format=png",
	maple: "https://img.icons8.com/?size=40&id=58786&format=png",
	ash: "https://img.icons8.com/?size=40&id=20728&format=png",
	oak: "https://img.icons8.com/?size=40&id=39874&format=png",
	elm: "https://img.icons8.com/?size=40&id=I8NE0pOnAQKj&format=png",
	pine: "https://img.icons8.com/?size=40&id=20554&format=png",
	birch: "https://img.icons8.com/?size=40&id=63770&format=png",
	beech: "https://img.icons8.com/?size=40&id=5fQBgYGaWfYx&format=png",
	willow: "https://img.icons8.com/?size=40&id=77987&format=png",
};

const iconImagesArr = Object.values(iconImages);

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

const Deckgl = () => {
	const [hoverInfo, setHoverInfo] = useState();

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
			data: audits,
			getColor: [255, 0, 255, 255],
			sizeUnits: "common",
			sizeMaxPixels: 40,
			sizeMinPixels: 4,
			getIcon: (d) => ({
				url: iconImagesArr[Math.floor(Math.random() * iconImagesArr.length)],
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
					left: 20,
					zIndex: 100,
				}}
			>
				<h1>DeckGL POC</h1>
				<p>Amount of elements displayed: {audits.length}</p>
			</div>
			{hoverInfo?.object && (
				<div
					style={{
						position: "absolute",
						top: "85vh",
						left: 20,
						zIndex: 100,
					}}
				>
					<h2>Item Id:</h2>
					<p>{hoverInfo.object.id}</p>
				</div>
			)}
			<DeckGLOverlay layers={layers} />
		</>
	);
};

export default Deckgl;
