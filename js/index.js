var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LayerGroup, Map, TileLayer } from 'leaflet';
import { MapUI } from './MapUI.js';
import { MapFunctions } from './MapFunctions.js';
const map = new Map('map').setView([-23.550385, -46.633956], 16);
const camada = new LayerGroup().addTo(map);
const mapUI = new MapUI(map, camada);
const mapFunctions = new MapFunctions(mapUI);
const inputOrigem = document.getElementById("origem");
const inputDestino = document.getElementById("destino");
const btnRota = document.getElementById("btn-rota");
const inputRaio = document.getElementById("raio");
const inputKms = document.getElementById("kms-totais");
new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
btnRota.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    let kmsTotais = yield mapFunctions.traceRoute(inputOrigem.value, inputDestino.value);
    inputKms.value = kmsTotais.toFixed(0).toString();
    mapUI.UpdateRadius(mapUI.radiusLatLon, Number(inputRaio.value));
}));
inputRaio.addEventListener("change", (e) => {
    mapUI.UpdateRadius(mapUI.radiusLatLon, Number(inputRaio.value));
});
