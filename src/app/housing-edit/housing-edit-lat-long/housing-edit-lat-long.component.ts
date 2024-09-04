import { Component, ElementRef, Input, ViewChild, afterNextRender } from '@angular/core';
import { HousingLocation } from '../../HousingLocation';
import * as L from 'leaflet';

@Component({
  selector: 'app-housing-edit-lat-long',
  standalone: true,
  imports: [],
  template: ` <div id="map" #map></div> `,
  styles: `#map{
            width: 500px;
            height: 300px;
          }`,
})
export class HousingEditLatLongComponent {
  @Input() housingLocation!: HousingLocation;
  @ViewChild('map') mapElement!: ElementRef;
  map!: any;
  resizeObserver!: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      console.log('this.map', this.mapElement);
      if (!this.map) this.initMap();
    });
  }
  ngOnInit(): void {}

  initMap() {
    this.map = L.map('map').setView([44.5258, 5.06604], 15);
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    return this.map;
  }

  ngOnDestroy(): void {
    this.map.remove();
  }
}
