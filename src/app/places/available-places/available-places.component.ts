import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private placesService = inject(PlacesService)
  private destroyRef = inject(DestroyRef)
  isFetching = signal(false)
  error = signal('')

  ngOnInit(){
    this.isFetching.set(true)
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
      next: (res) => {
        this.places.set(res.places)
      },
      error: ((error) => this.error.set(error.message)),
      complete: (() => this.isFetching.set(false))
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }

  onSelectPlace(place: Place){
    this.placesService.addPlaceToUserPlaces(place)
    .subscribe()
  }

}
