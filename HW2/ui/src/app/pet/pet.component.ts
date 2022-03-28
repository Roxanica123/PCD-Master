import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})
export class PetComponent implements OnInit {
  public name: string = "";
  public description: string = "";
  public age: number = 0;
  public rate: FormGroup | undefined;
  public imgLink: string = "";
  public altName: string = "";

  @Output() sendData = new EventEmitter<any>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.name = "Lola";
    this.description = "descriere";
    this.age = 1;
    this.rate = this.fb.group({
      rating: ['', Validators.required],
    })
    this.imgLink = "https://material.angular.io/assets/img/examples/shiba2.jpg";
    this.altName = "shiba2";
  }

  onClick() {
    this.sendData.emit(this.imgLink);
  }

}