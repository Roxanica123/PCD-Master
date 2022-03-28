import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss']
})
export class PetFormComponent implements OnInit {

  
  description: string = "";

  freelancerReward: Number = 1;
  evaluatorReward: Number = 0;

  domainExpertise: string = "";


  constructor() { }

  ngOnInit(): void {
  }

  public async submit(ngForm: NgForm) { }

}
