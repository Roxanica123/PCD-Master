import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PetService } from '../services/pet.service';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss']
})
export class PetFormComponent implements OnInit {

  public formData: FormData = new FormData();


  description: string = "";
  email: string = "";
  name: string = "";
  photos: any;

  accelt: any = undefined;

  constructor(private readonly service: PetService) { }

  ngOnInit(): void {
  }

  public async submit(ngForm: NgForm) {

    const data = {
      "description": this.description,
      "email": this.email,
      "name": this.name,
      "photos": this.photos
    }

    console.log(data)
    this.service.create(data).subscribe(data => console.log(data));

    ngForm.reset();
  }


}
