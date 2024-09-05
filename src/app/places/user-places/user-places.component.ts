import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../places.service';
@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  private placesService = inject(PlacesService)
  places = this.placesService.loadedUserPlaces
  private destroyRef = inject(DestroyRef)
  isFetching = signal(false)
  error = signal('')

  ngOnInit(){
    this.isFetching.set(true)
    const subscription = this.placesService.loadUserPlaces().subscribe({
      next: (res) => {
        // this.places.set(res.places)
      },
      error: ((error) => this.error.set(error.message)),
      complete: (() => this.isFetching.set(false))
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }

  onSelectPlace(place: Place){
    const subscription = this.placesService.removeUserPlace(place).subscribe()
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }

}
