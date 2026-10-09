import { Polyline, Map, map, LayerGroup } from "leaflet";
import { MapObjects } from "./MapObjects.ts";
import { MapUI } from "./MapUI.ts"

interface Geocode {
    lat: number,
    lon: number,
    name: string
}

export class MapFunctions {

    private Ui: MapUI;
    private Map: Map;
    private Layer: LayerGroup;

    constructor(ui: MapUI) {
        this.Ui = ui;
        this.Map = this.Ui.map;
        this.Layer = this.Ui.layer;
    }

    private async getGeocode(address: string): Promise<Geocode> {
        const url: string = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=pt-BR&q='
                + encodeURIComponent(address);
        
        const r: Response = await fetch(url);
        const data: any = await r.json();

        if (!data.length) throw new Error("Endereço não encontrado" + address);
        
        return { lat: +data[0].lat, lon: +data[0].lon, name: data[0].display_name }
    }

    async traceRoute(originAddress: string, destionationAddress: string): Promise<number> {
        let origin: Geocode = await this.getGeocode(originAddress);
        let destination: Geocode = await this.getGeocode(destionationAddress);

        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}`
            + '?overview=full&geometries=geojson&steps=true';
        const r: Response = await fetch(url);
        const data = await r.json();
        if (data.code !== "Ok") throw new Error("Rota não encontrada");

        const route = data.routes[0];

        const points = route.geometry.coordinates.map(([lon, lat]:[lon: number, lat: number]) => [lat, lon])

        this.Ui.Clear();
        this.Ui.CreateMarker([origin.lat, origin.lon], "<b> Origem: <br>" + origin.name, false);
        this.Ui.radiusLatLon = [origin.lat, origin.lon];

        this.Ui.CreateMarker([destination.lat, destination.lon], "<b>Destino: <br>" + destination.name, false, new MapObjects().redMarkerIcon);

        const line: Polyline = new Polyline(points, { color: '#2563eb', weight: 5 }).addTo(this.Layer);
        this.Map.fitBounds(line.getBounds(), { padding: [30, 30] });

        return (route.distance / 1000) * 2;
    }
}