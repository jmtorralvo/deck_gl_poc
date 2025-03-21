import { IconLayer } from "@deck.gl/layers";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import React, { useEffect, useMemo, useState } from "react";
import DeckGLOverlay from "../components/deck-gl-overlay";
import { UndoRedoControl } from "../components/undo-redo-control";
import { ICON_IMAGES } from "../const";
import audits from "../data/data.json";
import { useDrawingManager } from "../hooks/use-drawing-manager";

const filterItems = ({ items, filters }) => {
	return items.filter((item) => filters.includes(item.category));
};

const isSelected = ({ item, selectedItems }) =>
	selectedItems.some((selectedItem) => selectedItem.id === item.id);

const Deckgl = ({ filters }) => {
	const items = filterItems({ items: audits, filters });
	const [hoverInfo, setHoverInfo] = useState();
	const [selectedItems, setSelectedItems] = useState([]);
	const [selectMode, setSelectMode] = useState(false);

	const selectItems = (bounds) => {
		const newItems = items.filter(
			({ audit_start_coordinates: { lat, lng } }) => {
				return bounds.contains({ lat, lng });
			},
		);
		console.log("newItems", newItems);
		setSelectedItems(newItems);
	};

	const toggleSelectionItem = (item) => {
		const index = selectedItems.findIndex(
			(selectedItem) => selectedItem.id === item.id,
		);
		if (index === -1) {
			setSelectedItems([...selectedItems, item]);
		} else {
			const newSelectedItems = [...selectedItems];
			newSelectedItems.splice(index, 1);
			setSelectedItems(newSelectedItems);
		}
	};

	const drawingManager = useDrawingManager({ onSelect: selectItems });

	useEffect(() => {
		if (!drawingManager) return;
		drawingManager.addListener("drawingmode_changed", () => {
			const drawingMode = drawingManager.getDrawingMode();
			console.log("drawing mode changed", drawingMode);
			if (drawingMode) {
				setSelectMode(true);
				return;
			}
			setSelectMode(false);
		});
	}, [drawingManager]);

	const layers = useMemo(() => {
		const newlayers = [
			new IconLayer({
				id: "deckgl-icon",
				data: items,
				getColor: (d) => {
					// Handle Alpha makes it slower
					// const alpha =
					// 	selectMode && !isSelected({ item: d, selectedItems }) ? 128 : 255;
					return [0, 255, 255, 255];
				},
				sizeUnits: "common",
				sizeMaxPixels: 40,
				sizeMinPixels: 4,
				getIcon: (d) => ({
					url: isSelected({ item: d, selectedItems })
						? "https://img.icons8.com/?size=96&id=63312&format=png"
						: ICON_IMAGES[d.category],
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
					if (selectMode) {
						// When selectMode is enabled
						toggleSelectionItem(info.object);
					} else {
						setHoverInfo(info);
					}
				},
			}),
		];
		return newlayers;
	}, [selectMode, selectedItems, items]);

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
				<h2>DeckGL POC. SelectMode: {String(selectMode)}</h2>
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
			{Boolean(layers.length) && <DeckGLOverlay layers={layers} />}
		</>
	);
};

export default Deckgl;
