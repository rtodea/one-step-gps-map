import { ElementRef, Injectable } from '@angular/core';
import * as L from 'leaflet';
import {DevicePoint} from "../one-step-gps/one-step-gps.service";

@Injectable({
  providedIn: 'root'
})
export class LeafletService {
  private map: L.Map;

  private apiKey = 'pk.eyJ1IjoianBzdGlsbDg1IiwiYSI6ImNqbDcxZ3RsdDAxa3UzcG84b3lzaHRuZ2oifQ.CqIHqPgH0lwz2QldWcE37Q';

  private attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  initializeMap(el: ElementRef,
                lat: number,
                long: number = -0.09,
                zoom: number = 13,
                maxZoom: number = 18) {
    this.map = L.map(el.nativeElement)
      .setView([lat, long], zoom);
    /**
     * h = roads only
     * m = standard roadmap
     * p = terrain
     * r = somehow altered roadmap
     * s = satellite only
     * t = terrain only
     * y = hybrid
     */
    L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(this.map);
  }

  addMarker(lat: number, long: number, title?: string) {
    L.marker([lat, long], {
      title,
    }).addTo(this.map);
  }

  addPopupMarker(lat: number, long: number, popup: string) {
    const marker = L.marker([lat, long])
      .addTo(this.map);

    marker.bindPopup(popup).openPopup();
  }

  addCircle(lat: number, long: number, color: string, fill: string, opacity: number, radius: number) {
    L.circle([lat, long], {
      color,
      radius,
      fillColor: fill,
      fillOpacity: opacity
    }).addTo(this.map);
  }

  addLocationPoint({lat, lng}: DevicePoint) {
    const pointColor = '#27b76d';
    this.addCircle(lat, lng, pointColor, pointColor, 1, 10);
  }

  addPolygon(latlngs: L.LatLngExpression[] | L.LatLngExpression[][]) {
    L.polygon(latlngs).addTo(this.map);
  }

  registerClick(message: string) {
    const onMapClick = (e) => alert(`${message} ${e.latlng}`);
    this.map.on('click', onMapClick);
  }

  jumpToPoint({lat, lng}: DevicePoint) {
    this.map.flyTo([lat, lng]);
  }
}
