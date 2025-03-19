import { IconLayer } from "@deck.gl/layers";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import React, { useState } from "react";
import DeckGLOverlay from "../components/deck-gl-overlay";
import { UndoRedoControl } from "../components/undo-redo-control";
import { ICON_IMAGES } from "../const";
import audits from "../data/data.json";
import { useDrawingManager } from "../hooks/use-drawing-manager";

const filterItems = ({ items, filters }) => {
	return items.filter((item) => filters.includes(item.category));
};

const Deckgl = ({ filters }) => {
	const items = filterItems({ items: audits, filters });
	const [hoverInfo, setHoverInfo] = useState();
	const [selectedItems, setSelectedItems] = useState([]);

	const selectItems = (bounds) => {
		const newItems = items.filter(
			({ audit_start_coordinates: { lat, lng } }) => {
				// const lat = item.audit_start_coordinates.lat;
				// const lng = item.audit_start_coordinates.lng;
				return bounds.contains({ lat, lng });
			},
		);
		console.log("newItems", newItems);
		setSelectedItems(newItems);
	};

	const drawingManager = useDrawingManager({ onSelect: selectItems });

	const layers = [
		new IconLayer({
			id: "deckgl-icon",
			data: items,
			getColor: [255, 0, 255, 255],
			sizeUnits: "common",
			sizeMaxPixels: 40,
			sizeMinPixels: 4,
			getIcon: (d) => ({
				url: ICON_IMAGES[d.category],
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
			<MapControl position={ControlPosition.TOP_CENTER}>
				<UndoRedoControl drawingManager={drawingManager} />
			</MapControl>
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
				<p>Amount of elements selected: {selectedItems.length}</p>
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
