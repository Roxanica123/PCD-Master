import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css']
})
export class SlideShowComponent implements OnInit{
  
  public images: string[] = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  public ngOnInit(): void {
  }
}
