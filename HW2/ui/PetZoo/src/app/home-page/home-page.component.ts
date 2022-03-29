import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private readonly signalR: SignalRService) {
  }

  ngOnInit(): void {
    this.signalR.connect("ana@gmail.com");
  }

}
