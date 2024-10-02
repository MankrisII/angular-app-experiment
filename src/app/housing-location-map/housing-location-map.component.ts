import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, afterNextRender, afterRender } from '@angular/core';
import { HousingLocation } from '../HousingLocation';
import * as L from 'leaflet';


@Component({
  selector: 'app-housing-location-map',
  standalone: true,
  imports: [],
  templateUrl: './housing-location-map.component.html',
  styleUrl: './housing-location-map.component.css',
})
export class HousingLocationMapComponent implements OnInit, OnDestroy{
  @Input()
  set housingList(value: HousingLocation[]) {
    console.log('set housingList');
    console.log('this.map',this.map)
    this._housingList = value;
    if (this.map) { this.setMarker(); }
  }
  
  get housingList(): HousingLocation[]{
    return this._housingList;
  };
  private _housingList!: HousingLocation[];
  @ViewChild('map') mapElement!: ElementRef;
  map!: any 
  resizeObserver!: ResizeObserver;
  
  constructor() {
    console.log('constructor');
    afterNextRender(() => {
      console.log('afterNextRender'); 
      console.log('this.map', this.mapElement);
      
      if (!this.map && this.housingList) this.initMap()
  
      this.resizeObserver = new ResizeObserver(() => {
        this.resize();
      });
      this.resizeObserver.observe(document.body);
    });
  }
  ngOnInit(): void {
    console.log('ngoInit');
    console.log('housing', this.housingList[0]);
  }

  initMap() {
    console.log('initMap');
    setTimeout(() => {
      this.resize();
      this.map = L.map('map').setView([44.525800, 5.066040], 15);
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
      console.log('housingList', this.housingList);
      if(this.housingList) this.setMarker();
      
        
        return this.map
    }, 200);
  }

  setMarker() {
    console.log('setMarker');

    this._housingList.forEach((housing) => {
      if (housing.coords) {        // TODO: temp fix for missing coords

        L.marker([Number(housing.coords.lat), Number(housing.coords.lon),])
          .addTo(this.map);
        // .bindPopup(
        //   `<b>${housing.title}</b><br>${housing.price}€<br>${housing.surface}m²`
        // );
      }
    });
  }

  resize() {
    let computedHeight = window.innerHeight - this.mapElement.nativeElement.offsetTop - 5;

    this.mapElement.nativeElement.style.height = computedHeight + 'px';
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    this.map.remove()
    this.resizeObserver.unobserve(document.body);
  }

}
