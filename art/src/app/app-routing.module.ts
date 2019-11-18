import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanoramaComponent } from './panorama/panorama.component';
import { Page404Component } from './page404/page404.component';
import { LiveartScanerComponent } from './liveart-scaner/liveart-scaner.component';
import { TourListComponent } from './tour-list/tour-list.component';
import { ExhibitDetailsComponent } from './exhibit-details/exhibit-details.component';
import { ExhibitAvComponent } from './exhibit-av/exhibit-av.component';
import { ExhibitShopComponent } from './exhibit-shop/exhibit-shop.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: MainComponent },
  { path: 'exhibit/:name', component: ExhibitsComponent, children: [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', component: ExhibitDetailsComponent },
    { path: 'av', component: ExhibitAvComponent },
    { path: 'shop', component: ExhibitShopComponent },
  ]},
  { path: 'liveart-scaner', component: LiveartScanerComponent },
  { path: 'tour/:id', component: TourDetailsComponent },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
