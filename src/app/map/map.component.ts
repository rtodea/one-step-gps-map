import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LeafletService } from '../core/leaflet.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('leaflet') mapElement: ElementRef;

  constructor(private leaflet: LeafletService) { }

  ngAfterViewInit(): void {
    this.leaflet.initializeMap(this.mapElement, 51.505);
    // this.leaflet.addPopupMarker(51.5, -0.09, "<b>Hello world!</b><br>I am a popup.");
    this.leaflet.addCircle(51.508, -0.11, 'red', '#ff0033', 0.5, 500);
    // this.leaflet.addPolygon([[51.509, -0.08], [51.503, -0.06], [51.51, -0.049]]);
    // this.leaflet.registerClick('You clicked at');
  }
}
