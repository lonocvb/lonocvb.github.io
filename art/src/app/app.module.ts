import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ExhibitDetailsComponent } from './exhibit-details/exhibit-details.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { ExhibitShopComponent } from './exhibit-shop/exhibit-shop.component';
import { ExhibitAvComponent } from './exhibit-av/exhibit-av.component';
import { LiveartScanerComponent } from './liveart-scaner/liveart-scaner.component';
import { Page404Component } from './page404/page404.component';
import { TourListComponent } from './tour-list/tour-list.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { PelementDirective } from './panorama/pelement.directive';
import { MainComponent } from './main/main.component';
import { FloatTopDirective } from './float-top.directive';

@NgModule({
  declarations: [
    AppComponent,
    PanoramaComponent,
    ExhibitDetailsComponent,
    TourDetailsComponent,
    ExhibitShopComponent,
    ExhibitAvComponent,
    LiveartScanerComponent,
    Page404Component,
    TourListComponent,
    ExhibitsComponent,
    PelementDirective,
    MainComponent,
    FloatTopDirective,
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
