import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from "./home-page/home-page.component"
import {PetFormComponent} from "./pet-form/pet-form.component"

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'new',
    component: PetFormComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
