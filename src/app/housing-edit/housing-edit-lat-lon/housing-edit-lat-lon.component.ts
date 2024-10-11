import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  afterNextRender,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { HousingLocation, HousingLocationCoords } from '../../HousingLocation';
import * as L from 'leaflet';
import { AbstractControl, FormGroup } from '@angular/forms';
import { debounceTime, defer, distinctUntilChanged, take } from 'rxjs';

@Component({
  selector: 'app-housing-edit-lat-lon',
  standalone: true,
  imports: [],
  template: ` <div id="map" #map></div> `,
  styles: `
    #map {
      width: 500px;
      height: 300px;
    }
  `,
})
export class HousingEditLatLonComponent {
  // @Input() housingLocation!: HousingLocation;
  @Input() set housingLocation(value: HousingLocation) {
    //console.log('set housingLocation');
    //console.log('this.map', this.map);
    this._housingLocation = value;
    if (this.map) {
      this.setMarkerCoords(this.housingLocation.coords!);
    }
  }

  get housingLocation(): HousingLocation {
    return this._housingLocation;
  }
  private _housingLocation!: HousingLocation;
  @Input() editForm!: FormGroup;
  @ViewChild('map') mapElement!: ElementRef;
  map!: any;
  resizeObserver!: ResizeObserver;
  coords!: HousingLocationCoords;
  marker!: any;

  constructor() {
    afterNextRender(() => {
      //console.log('afterNextRender');
      if (!this.map) this.initMap();
      if (this.housingLocation)
        this.setMarkerCoords(this.housingLocation.coords!);
    });
  }

  ngOnInit(): void {
    //console.log('ngoInit');
    //console.log('housing', this.housingLocation);
    //console.log('editForm', this.editForm);

    this.editForm.controls['coords'].valueChanges.subscribe((value) => {
      //console.log('lat-long - coords', value);
      this.coords = value;
      this.setMarkerCoords(this.coords);
    });
  }

  initMap() {
    this.map = L.map('map').setView([44.5258, 5.06604], 15);
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );
    tiles.addTo(this.map);
    return this.map;
  }

  setMarkerCoords(coords: HousingLocationCoords) {
    if (!this.marker) {
      this.createMarker(coords);
      return;
    }

    this.marker.setLatLng([Number(coords.lat), Number(coords.lon)]);
    this.map.panTo([Number(coords.lat), Number(coords.lon)]);

    //console.log('marker getLatLng', this.marker.getLatLng());
  }

  createMarker(coords: HousingLocationCoords) {
    this.marker = L.marker([Number(coords.lat), Number(coords.lon)], {
      draggable: true,
    }).addTo(this.map);

    this.map.panTo([Number(coords.lat), Number(coords.lon)]);

    //console.log('create marker getLatLng', this.marker.getLatLng());

    this.marker.addEventListener('dragend', (event: any) => {
      //console.log('marker end', event);
      this.editForm.controls['coords'].patchValue({
        lat: event.target._latlng.lat,
        lon: event.target._latlng.lng,
      });
    });
    return this.marker;
  }

  ngOnDestroy(): void {
    this.map.remove();
  }
}
