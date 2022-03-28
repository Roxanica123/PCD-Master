import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PetComponent } from './pet/pet.component';
import { PetViewComponent } from './pet-view/pet-view.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path:'pet', component: PetComponent},
  { path: 'view', component: PetViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }