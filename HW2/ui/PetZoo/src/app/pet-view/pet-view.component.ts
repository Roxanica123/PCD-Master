import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface PetModel{
  name:string;
  identifier:string;
  description:string;
  "price-estimate":number;
  email:string
  auction:string

}


@Component({
  selector: 'app-pet-view',
  templateUrl: './pet-view.component.html',
  styleUrls: ['./pet-view.component.scss']
})
export class PetViewComponent implements OnInit {

  pets:PetModel[] = [];

  public readonly basePhotoURL = "https://storage.googleapis.com/pets-photos/"
  public readonly photo ="/1.png"

  constructor(private http: HttpClient) { 

  }

  photoURL(id:string){
    if ( id == null ){
      return "https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg"
    }

    let rez = this.basePhotoURL + id + this.photo
    return rez
  }

  ngOnInit(): void {
    this.http.get<PetModel[]>("https://winter-justice-345019.ew.r.appspot.com/pets").subscribe( data => {
      this.pets = data
      console.table(data)
    })
   
  }

}
