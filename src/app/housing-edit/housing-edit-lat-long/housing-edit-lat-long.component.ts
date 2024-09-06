import { Component, ElementRef, Input, ViewChild, afterNextRender, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { HousingLocation } from '../../HousingLocation';
import * as L from 'leaflet';
import { FormGroup } from '@angular/forms';
import { debounceTime, defer, distinctUntilChanged } from 'rxjs';

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
  @Input() editForm!: FormGroup;
  @ViewChild('map') mapElement!: ElementRef;
  map!: any;
  resizeObserver!: ResizeObserver;

  constructor() {
    // afterNextRender(() => {
    //   console.log('afterNextRender');
    //   console.log('this.map', this.mapElement);
    //   if (!this.map) this.initMap();
    // });
  }
  ngOnInit(): void {
    // this.editForm.valueChanges.subscribe((form) => {
    //   console.log('form', form);
    // })
  }
  
  init() {
    console.log('init');
    this.editForm.valueChanges
      .pipe(debounceTime(300),
        distinctUntilChanged((prev, curr) => {
          return prev.adress === curr.adress && prev.city === curr.city;
        })
    )
      .subscribe((form) => {
      // console.log('form', form);
      let adress =
        form.adress.replace(/ /g, '+') + '+' + form.city.replace(/ /g, '+');
      console.log('adress', adress);
    });
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

  ngOnDestroy(): void {
    this.map.remove();
  }
}
