import { Map, Marker, LatLngExpression, LayerGroup, LeafletMouseEvent, Icon, Circle, circle, LatLngBounds } from "leaflet";

export class MapUI {
    map: Map;
    layer: LayerGroup;
    radiusCircle?: Circle;
    public radiusLatLon: LatLngExpression = [0, 0];

    constructor(map: Map, layer: LayerGroup) {
        this.layer = layer;
        this.map = map;
    }

    Clear() {
        this.layer.clearLayers();
    }

    CreateMarker(latlong: LatLngExpression, popupTxt: string, show: boolean = false, icon?: Icon) {
        let marker: Marker = new Marker(latlong);
        if (icon) marker.options.icon = icon;
        marker.bindPopup(popupTxt);

        marker.addTo(this.layer);
        if (show == true) marker.openPopup();
        marker.on("click", (e: LeafletMouseEvent) => {
            this.map.panTo(marker.getLatLng());
        })
    }

    UpdateRadius(latlong: LatLngExpression, radius: number) {
        if (this.radiusCircle != null) this.radiusCircle.remove();

        this.radiusCircle = new Circle(latlong, {
            radius: (radius * 1000),
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2
        })

        this.radiusCircle.addTo(this.layer);
    }
}

