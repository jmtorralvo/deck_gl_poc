// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import { CompositeLayer } from "@deck.gl/core";
import { IconLayer } from "@deck.gl/layers";
import Supercluster from "supercluster";

function getIconName(size) {
	if (size === 0) {
		return "";
	}
	if (size < 10) {
		return `marker-${size}`;
	}
	if (size < 100) {
		return `marker-${Math.floor(size / 10)}0`;
	}
	return "marker-100";
}

function getIconSize(size) {
	return Math.min(100, size) / 100 + 1;
}

export default class IconClusterLayer extends CompositeLayer {
	shouldUpdateState({ changeFlags }) {
		return changeFlags.somethingChanged;
	}

	updateState({ props, oldProps, changeFlags }) {
		const rebuildIndex =
			changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

		if (rebuildIndex) {
			const index = new Supercluster({
				maxZoom: 16,
				radius: props.sizeScale * Math.sqrt(2),
			});
			index.load(
				// @ts-ignore Supercluster expects proper GeoJSON feature
				props.data.map((d) => ({
					geometry: { coordinates: props.getPosition(d) },
					properties: d,
				})),
			);
			this.setState({ index });
		}

		const z = Math.floor(this.context.viewport.zoom);
		if (rebuildIndex || z !== this.state.z) {
			this.setState({
				data: this.state.index.getClusters([-180, -85, 180, 85], z),
				z,
			});
		}
	}

	getPickingInfo({ info, mode }) {
		const pickedObject = info.object?.properties;
		if (pickedObject) {
			let objects;
			if (pickedObject.cluster && mode !== "hover") {
				objects = this.state.index
					.getLeaves(pickedObject.cluster_id, 25)
					.map((f) => f.properties);
			}
			return { ...info, object: pickedObject, objects };
		}
		return { ...info, object: undefined };
	}

	renderLayers() {
		const { data } = this.state;
		const { iconAtlas, iconMapping, sizeScale } = this.props;

		return new IconLayer(
			{
				data,
				iconAtlas,
				iconMapping,
				sizeScale,
				getPosition: (d) => d.geometry.coordinates,
				getIcon: (d) => getIconName(1),
				getSize: (d) => getIconSize(100),
			},
			this.getSubLayerProps({
				id: "icon",
			}),
		);
	}
}
