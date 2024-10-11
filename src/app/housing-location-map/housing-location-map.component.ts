import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  afterRender,
  effect,
  inject,
} from '@angular/core';
import { HousingLocation } from '../HousingLocation';
import * as L from 'leaflet';
import { NgFor } from '@angular/common';
import { HousinglocationCardComponent } from '../housing-location-grid/housinglocation-card/housinglocation-card.component';
import { HousingService } from '../housing.service';
import { DocumentSnapshot } from 'firebase/firestore';

@Component({
  selector: 'app-housing-location-map',
  standalone: true,
  imports: [NgFor, HousinglocationCardComponent],
  templateUrl: './housing-location-map.component.html',
  styleUrl: './housing-location-map.component.css',
})
export class HousingLocationMapComponent implements OnInit, OnDestroy {
  @Input()
  set housingList(value: DocumentSnapshot[]) {
    //console.log('set housingList');
    //console.log('this.map',this.map)
    this._housingList = value;
    if (this.map) {
      this.setMarker();
    }
  }

  get housingList(): DocumentSnapshot[] {
    return this._housingList;
  }

  private _housingList!: DocumentSnapshot[];

  @ViewChild('map') mapElement!: ElementRef;

  housingService = inject(HousingService);
  map!: any;
  resizeObserver!: ResizeObserver;

  constructor() {
    //console.log('constructor');
    afterNextRender(() => {
      //console.log('afterNextRender');
      //console.log('this.map', this.mapElement);

      this.initMap();

      this.resizeObserver = new ResizeObserver(() => {
        this.resize();
      });
      this.resizeObserver.observe(document.body);
    });

    effect(() => {
      console.log('effect');
      this.housingList = this.housingService.housinLocationsDocsSig();
    });
  }

  ngOnInit(): void {
    //console.log('ngoInit');
    //console.log('housing', this.housingList[0]);
  }

  initMap() {
    //console.log('initMap');
    setTimeout(() => {
      this.resize();
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
      //console.log('housingList', this.housingList);
      if (this.housingList) this.setMarker();

      return this.map;
    }, 200);
  }

  setMarker() {
    //console.log('setMarker');
    let markerPane: HTMLElement = this.map.getPane('markerPane');
    let shadowPane: HTMLElement = this.map.getPane('shadowPane');
    //console.log('markerPane', markerPane);
    markerPane.innerHTML = '';
    shadowPane.innerHTML = '';

    this._housingList.forEach((docSnap) => {
      let housing = docSnap.data() as HousingLocation;
      if (housing.coords) {
        // TODO: temp fix for missing coords

        let marker = L.marker([
          Number(housing.coords.lat),
          Number(housing.coords.lon),
        ]);
        marker.addTo(this.map);

        setTimeout(() => {
          console.log(docSnap.id!);
          console.log(document.getElementById(docSnap.id!));

          marker.bindPopup(document.getElementById(docSnap.id!) as HTMLElement);
          marker.bindTooltip(housing.address!);
        }, 200);
      }
    });
  }

  resize() {
    let computedHeight =
      window.innerHeight - this.mapElement.nativeElement.offsetTop - 5;

    this.mapElement.nativeElement.style.height = computedHeight + 'px';
  }

  ngOnDestroy(): void {
    //console.log('ngOnDestroy');
    this.map.remove();
    this.resizeObserver.unobserve(document.body);
  }
}
