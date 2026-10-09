var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Polyline } from "leaflet";
import { MapObjects } from "./MapObjects.js";
export class MapFunctions {
    constructor(ui) {
        this.Ui = ui;
        this.Map = this.Ui.map;
        this.Layer = this.Ui.layer;
    }
    getGeocode(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=pt-BR&q='
                + encodeURIComponent(address);
            const r = yield fetch(url);
            const data = yield r.json();
            if (!data.length)
                throw new Error("Endereço não encontrado" + address);
            return { lat: +data[0].lat, lon: +data[0].lon, name: data[0].display_name };
        });
    }
    traceRoute(originAddress, destionationAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            let origin = yield this.getGeocode(originAddress);
            let destination = yield this.getGeocode(destionationAddress);
            const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}`
                + '?overview=full&geometries=geojson&steps=true';
            const r = yield fetch(url);
            const data = yield r.json();
            if (data.code !== "Ok")
                throw new Error("Rota não encontrada");
            const route = data.routes[0];
            const points = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
            this.Ui.Clear();
            this.Ui.CreateMarker([origin.lat, origin.lon], "<b> Origem: <br>" + origin.name, false);
            this.Ui.radiusLatLon = [origin.lat, origin.lon];
            this.Ui.CreateMarker([destination.lat, destination.lon], "<b>Destino: <br>" + destination.name, false, new MapObjects().redMarkerIcon);
            const line = new Polyline(points, { color: '#2563eb', weight: 5 }).addTo(this.Layer);
            this.Map.fitBounds(line.getBounds(), { padding: [30, 30] });
            return (route.distance / 1000) * 2;
        });
    }
}
