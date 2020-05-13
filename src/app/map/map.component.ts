import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LeafletService } from '../core/leaflet.service';
import * as R from 'ramda';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('leaflet') mapElement: ElementRef;

  constructor(private leaflet: LeafletService) { }

  ngAfterViewInit(): void {
    const minneapolisCenter = {
      lat: 45.066080799999995,
      lng: -93.30076849999999,
    };
    this.leaflet.initializeMap(this.mapElement, minneapolisCenter.lat, minneapolisCenter.lng);
    // this.leaflet.addPopupMarker(51.5, -0.09, "<b>Hello world!</b><br>I am a popup.");
    // this.leaflet.addCircle(51.508, -0.11, 'red', '#ff0033', 0.5, 500);
    // this.leaflet.addPolygon([[51.509, -0.08], [51.503, -0.06], [51.51, -0.049]]);
    // this.leaflet.registerClick('You clicked at');

    const pointsOfInterest = [
      {
        lat: 45.00145,
        lng: -93.3221599,
        title: 'loveworks',
      },
    ];

    (pointsOfInterest).forEach(({lat, lng, title}) => {
      this.leaflet.addPopupMarker(lat, lng, title);
    });
  }
}
