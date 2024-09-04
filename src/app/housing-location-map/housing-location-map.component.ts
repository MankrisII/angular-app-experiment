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
  @Input() housingList!: HousingLocation[];
  @ViewChild('map') mapElement!: ElementRef;
  map!: any 
  resizeObserver!: ResizeObserver;
  
  constructor() {
    afterNextRender(() => {
      console.log('this.map', this.mapElement);
      if (!this.map) this.initMap()
      this.resizeObserver = new ResizeObserver(() => {
        this.resize();
      });
      this.resizeObserver.observe(document.body);
    });
  }
  ngOnInit(): void {
    
  }

  initMap() {
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
    return this.map
  }

  resize() {
    let computedHeight = window.innerHeight - this.mapElement.nativeElement.offsetTop - 5;
    this.mapElement.nativeElement.style.height = computedHeight + 'px';
  }

  ngOnDestroy(): void {
    this.map.remove()
  }

}
