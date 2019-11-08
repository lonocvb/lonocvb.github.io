import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ExhibitDetailsComponent } from './exhibit-details/exhibit-details.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { LiveartListComponent } from './liveart-list/liveart-list.component';
import { ExhibitShopComponent } from './exhibit-shop/exhibit-shop.component';
import { ExhibitAvComponent } from './exhibit-av/exhibit-av.component';
import { LiveartCameraComponent } from './liveart-camera/liveart-camera.component';
import { LiveartScanerComponent } from './liveart-scaner/liveart-scaner.component';
import { Page404Component } from './page404/page404.component';
import { TourListComponent } from './tour-list/tour-list.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
@NgModule({
  declarations: [
    AppComponent,
    PanoramaComponent,
    ExhibitDetailsComponent,
    TourDetailsComponent,
    LiveartListComponent,
    ExhibitShopComponent,
    ExhibitAvComponent,
    LiveartCameraComponent,
    LiveartScanerComponent,
    Page404Component,
    TourListComponent,
    ExhibitsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
