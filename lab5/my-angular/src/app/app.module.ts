import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from  '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrokerComponent } from './components/broker/broker.component';
import { StockComponent } from './components/stock/stock.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InputComponent } from './components/input/input.component';

const appRoutes: Routes = [
  {path: '', component: BrokerComponent},
  {path: 'brokers', component: BrokerComponent},
  {path: 'stocks', component: StockComponent},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    BrokerComponent,
    StockComponent,
    SettingsComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
