import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PetService } from '../services/pet.service';
import { PetModel } from '../services/types';

@Component({
  selector: 'app-pet-view',
  templateUrl: './pet-view.component.html',
  styleUrls: ['./pet-view.component.scss']
})
export class PetViewComponent implements OnInit {

  pets: PetModel[] = [];

  public readonly basePhotoURL = "https://storage.googleapis.com/pets-photos/"
  public readonly photo = "/1.png"

  constructor(private http: HttpClient, private readonly petService: PetService) {

  }

  photoURL(id: string) {
    if (id == null) {
      return "https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg"
    }

    let rez = this.basePhotoURL + id + this.photo
    return rez
  }

  ngOnInit(): void {
    this.petService.subject.subscribe(pets => this.pets = pets);
  }

}
