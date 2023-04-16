import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestComponent } from './components/request/request.component';
import { HttpClientModule } from '@angular/common/http';

import { Chart } from 'chart.js';
import { registerables } from 'chart.js'
Chart.register(...registerables);

@NgModule({
  declarations: [
    AppComponent,
    RequestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
