import { LayerGroup, Map, TileLayer } from 'leaflet';
import { MapUI } from './MapUI.ts';
import { MapFunctions } from './MapFunctions.ts';

const map: Map = new Map('map').setView([-23.550385, -46.633956], 16);
const camada: LayerGroup = new LayerGroup().addTo(map);
const mapUI: MapUI = new MapUI(map, camada);
const mapFunctions: MapFunctions = new MapFunctions(mapUI);

const inputOrigem: HTMLInputElement = document.getElementById("origem") as HTMLInputElement;
const inputDestino: HTMLInputElement = document.getElementById("destino") as HTMLInputElement;
const btnRota: HTMLButtonElement = document.getElementById("btn-rota") as HTMLButtonElement;
const inputRaio: HTMLInputElement = document.getElementById("raio") as HTMLInputElement;
const inputKms: HTMLInputElement = document.getElementById("kms-totais") as HTMLInputElement;

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

btnRota.addEventListener("click", async (e: MouseEvent) => {
    let kmsTotais: number = await mapFunctions.traceRoute(inputOrigem.value, inputDestino.value);
    inputKms.value = kmsTotais.toFixed(0).toString();
    mapUI.UpdateRadius(mapUI.radiusLatLon, Number(inputRaio.value));
});

inputRaio.addEventListener("change", (e: Event) => {
    mapUI.UpdateRadius(mapUI.radiusLatLon, Number(inputRaio.value));
});

