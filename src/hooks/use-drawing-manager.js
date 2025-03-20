import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export function useDrawingManager({ initialValue = null, onSelect }) {
	const map = useMap();
	const drawing = useMapsLibrary("drawing");

	const [drawingManager, setDrawingManager] = useState(initialValue);
	const [rectangle, setRectangle] = useState(null);

	useEffect(() => {
		if (!map || !drawing) return;

		// https://developers.google.com/maps/documentation/javascript/reference/drawing
		const newDrawingManager = new drawing.DrawingManager({
			map,
			//drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
			drawingControl: true,
			drawingControlOptions: {
				position: window.google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
					// window.google.maps.drawing.OverlayType.MARKER,
					// window.google.maps.drawing.OverlayType.CIRCLE,
					// window.google.maps.drawing.OverlayType.POLYGON,
					// window.google.maps.drawing.OverlayType.POLYLINE,
					window.google.maps.drawing.OverlayType.RECTANGLE,
				],
			},
			// markerOptions: {
			// 	draggable: true,
			// },
			// circleOptions: {
			// 	editable: true,
			// 	fillColor: "#FF0000",
			// },
			// polygonOptions: {
			// 	editable: true,
			// 	draggable: true,
			// 	fillColor: "#FF0000",
			// },
			rectangleOptions: {
				editable: true,
				draggable: true,
			},
			// polylineOptions: {
			// 	editable: true,
			// 	draggable: true,
			// },
		});

		newDrawingManager.addListener("rectanglecomplete", (newRectangle) => {
			if (rectangle) {
				//remove the previous rectangle
				rectangle.visible = false;
				rectangle.setMap(null);
			}
			setRectangle(newRectangle);
			const bounds = newRectangle.getBounds();
			onSelect(bounds);
		});

		setDrawingManager(newDrawingManager);

		return () => {
			newDrawingManager.setMap(null);
		};
	}, [drawing, map, rectangle]);

	return drawingManager;
}
