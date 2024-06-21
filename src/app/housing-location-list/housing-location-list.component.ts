import { Component, OnInit } from '@angular/core';
import { HousingLocation } from '../HousingLocation';
import { Input } from '@angular/core';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { IsOptionAvailableComponent } from '../is-option-available/is-option-available.component';
import { RouterLink } from '@angular/router';
import { HousingService } from '../housing.service';
import { ListSorterHeadingComponent } from '../list-sorter-heading/list-sorter-heading.component';
import { Queryoptions } from '../queryoptions';


@Component({
  selector: 'app-housing-location-list',
  standalone: true,
  imports: [LocationDetailsComponent, IsOptionAvailableComponent, RouterLink, ListSorterHeadingComponent],
  template: `
  <section class="housingList list">
    <table class="housing-location-list">
        <tr>
          <th><input type="checkbox"></th>
          <th class="photo">photo</th>
          <th class="name"><app-list-sorter-heading (ordering)="order($event)" [orderedBy]="housingService.getOrderBy()" label="Name" by="name"/></th>
          <th class="city"><app-list-sorter-heading (ordering)="order($event)" [orderedBy]="housingService.getOrderBy()" label="City" by="city"/></th>
          <th class="state"><app-list-sorter-heading (ordering)="order($event)" [orderedBy]="housingService.getOrderBy()" label="State" by="state"/></th>
          <th class="available-units"><app-list-sorter-heading (ordering)="order($event)" [orderedBy]="housingService.getOrderBy()" label="Unit Avaliable" by="availableUnits"/></th>
          <th class="wifi">Wifi</th>
          <th class="laundry">Laundry</th>
          <th class="actions">actions</th>
        </tr>
    @for(housingLocation of housingList;track housingLocation){
        <tr class="housing-location-list">
          <td><input type="checkbox"></td>
          <td class="photo"><img src="{{housingLocation.photo}}"></td>
          <td class="name"> {{ housingLocation.name }}</td>
          <td class="city">{{housingLocation.city}}</td>
          <td class="state">{{housingLocation.state}}</td>
          <td class="available-units">{{housingLocation.availableUnits}}</td>
          <td class="wifi">@if(housingLocation.wifi){yes}@else{no}</td>
          <td class="laundry">@if(housingLocation.laundry){yes}@else{no}</td>
          <td class="actions"><a class="actionLink" [routerLink]="['details',housingLocation.id]">Details</a> -
          <a class="actionLink" [routerLink]="['edit',housingLocation.id]">Edit</a> -
          <a class="actionLink" (click)="delete(housingLocation.id)">Delete</a></td>
        </tr>
      }
  </table>
  </section>

  `,
  styleUrl: './housing-location-list.component.css'
})
export class HousingLocationListComponent implements OnInit{
  @Input() housingList!: HousingLocation[]
  housingService
  constructor(housingService: HousingService) {
    this.housingService = housingService
  }

  ngOnInit() {
  }
  
  order(event:Queryoptions) {
    this.housingList = this.housingService.getHousingLocationListByQuery(event)
  }

  delete(id: number) {
    this.housingService.deleteHousingLocation(id)
  }
}
