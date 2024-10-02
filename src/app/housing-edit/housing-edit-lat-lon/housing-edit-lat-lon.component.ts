import { Component, ElementRef, Input, ViewChild, afterNextRender, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { HousingLocation } from '../../HousingLocation';
import * as L from 'leaflet';
import { AbstractControl, FormGroup } from '@angular/forms';
import { debounceTime, defer, distinctUntilChanged, take } from 'rxjs';
import { HousingFormDataCoords } from '../HousingFormData';

@Component({
  selector: 'app-housing-edit-lat-lon',
  standalone: true,
  imports: [],
  template: ` <div id="map" #map></div> `,
  styles: `#map{
            width: 500px;
            height: 300px;
          }`,
})
export class HousingEditLatLonComponent {
  @Input() housingLocation!: HousingLocation;
  @Input() editForm!: FormGroup;
  @ViewChild('map') mapElement!: ElementRef;
  map!: any;
  resizeObserver!: ResizeObserver;
  coords!: HousingFormDataCoords;
  marker!: any;

  constructor() {
    
  }
  ngOnInit(): void {
    this.editForm.valueChanges.pipe(take(1)).subscribe((form) => {
      console.log('form init')
      this.initMap();
    }
    );

    this.editForm.controls['coords'].valueChanges.subscribe((value) => {
      console.log('lat-long - coords', value);
      this.coords = value;
      this.setMarkerCoords(this.coords);
    })
  }
  
  init() {
    console.log('init');
    // this.editForm.valueChanges
    //   .pipe(debounceTime(300),
    //     distinctUntilChanged((prev, curr) => {
    //       return prev.adress === curr.adress && prev.city === curr.city;
    //     })
    // )
    //   .subscribe((form) => {
    //   // console.log('form', form);
    //   let adress = form.adress.replace(/ /g, '+') + '+' + form.city.replace(/ /g, '+');
    //   console.log('adress', adress);
    // });
    this.initMap()
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
      }
    );
    tiles.addTo(this.map);
    return this.map;
  }

  setMarkerCoords(coords: HousingFormDataCoords) {
    if (!this.marker) {
      this.createMarker(coords);
      return;
    }

    this.marker.setLatLng([Number(coords.lat), Number(coords.lon)]);
    this.map.setView([Number(coords.lat), Number(coords.lon)], 15);
    
    console.log('marker getLatLng', this.marker.getLatLng());
  }

  createMarker(coords: HousingFormDataCoords) {
    this.marker = L.marker([Number(coords.lat), Number(coords.lon)], {
      draggable: true,
    }).addTo(this.map);

    this.map.setView([Number(coords.lat), Number(coords.lon)], 15);
    
    console.log('create marker getLatLng', this.marker.getLatLng());

    this.marker.addEventListener('dragend', (event: any) => {
      console.log('marker dragend', event);
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
