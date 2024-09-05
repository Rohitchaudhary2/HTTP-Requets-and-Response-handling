import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient)
  private errorService = inject(ErrorService)

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places')
    .pipe(tap({
      next: (userPlaces) => this.userPlaces.set(userPlaces.places)
    }))
  }

  addPlaceToUserPlaces(place: Place) {

    const placeExist = this.userPlaces().some(userPlace => userPlace.id === place.id)

    const prevUserPlaces = this.userPlaces()
    
    if(!placeExist)
    {
      this.userPlaces.set([...prevUserPlaces, place])
    }

    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id
    })
    .pipe(
      catchError ((error) => {
        this.userPlaces.set(prevUserPlaces)
        this.errorService.showError('Error while adding in favourites')
        return throwError(() => new Error ('Error adding user places'));
      })
    )
  }

  removeUserPlace(place: Place) {
    const prevUserPlaces = this.userPlaces()
    this.userPlaces.set(this.userPlaces().filter((userPlace) => userPlace.id !== place.id))

    return this.httpClient.delete(`http://localhost:3000/user-places/${place.id}`)
    .pipe(
      catchError ((error) => {
        this.userPlaces.set(prevUserPlaces)
        this.errorService.showError('Error removing user')
        return throwError(() => new Error ('Error adding user places'));
      })
    )
  }

  fetchPlaces(url: string){
    return this.httpClient.get<{places: Place[]}>(url)
  }
}
