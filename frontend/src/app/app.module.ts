import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';


import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './home/home.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TimelineComponent,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTabsModule,
    MatInputModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
