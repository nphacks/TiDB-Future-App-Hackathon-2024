import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {
  articles: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getArticles().subscribe(data => {
      this.articles = data;
    });
  }
}
