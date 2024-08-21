import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  animations: [
    trigger('moveUp', [
      state('initial', style({ transform: 'translateY(0)' })),
      state('moved', style({ transform: 'translateY(-100px)' })),
      transition('initial <=> moved', animate('500ms ease-in-out'))
    ]),
    trigger('moveLeft', [
      state('hidden', style({ left: '50%', transform: 'translateX(-50%)', opacity: 0 })),
      state('visible', style({ left: '0', transform: 'translateX(0)', opacity: 1 })),
      transition('hidden => visible', animate('500ms ease-in-out'))
    ]),
    trigger('moveRight', [
      state('hidden', style({ right: '50%', transform: 'translateX(50%)', opacity: 1 })),
      state('visible', style({ right: '0', transform: 'translateX(0)', opacity: 1 })),
      transition('hidden => visible', animate('500ms ease-in-out'))
    ]),
    trigger('containerAnimation', [
      state('initial', style({ height: '200px', top: '0' })),
      state('expanded', style({ height: '75vh', top: '-20px' })),
      transition('initial <=> expanded', animate('500ms ease-in-out'))
    ])
  ]
})
export class TimelineComponent {
  timelineClicked = false;
  timelineActivate = false;
  newsActivate = false;
  moveState = 'initial';
  leftState = 'hidden';
  rightState = 'hidden';
  containerState = 'initial';
  searchNewsText = ''
  newsArticle: any;
  newsTimelineActicles: any;

  constructor(private timelineService: TimelineService) {}

  test = {
    "article": {
        "source": {
            "id": null,
            "name": "Digital Journal"
        },
        "author": "AFP",
        "title": "New ‘Call of Duty’ and ‘Borderlands 4’ games announced at leading show",
        "description": "The announcements set the scene for the leading international video game show that opens to the public in Cologne on Thursday.\nThe post New ‘Call of Duty’ and ‘Borderlands 4’ games announced at leading show appeared first on Digital Journal.",
        "url": "https://www.digitaljournal.com/entertainment/new-call-of-duty-and-borderlands-4-games-announced-at-leading-show/article",
        "urlToImage": "https://www.digitaljournal.com/wp-content/uploads/2024/08/5c44442cd4df6b3eb9865bc616e96e417e85c664.jpg",
        "publishedAt": "2024-08-20T22:16:00Z",
        "content": "A new \"Borderlands\" game is to be released in 2025 - Copyright AFP VALERIE MACON\r\nThe release dates for new episodes of the “Call of Duty” and “Borderlands” video games were announced Tuesday at the … [+1333 chars]"
    }
}

  searchNews() {
    this.moveState = 'moved';
    this.containerState = 'expanded';
    // this.newsActivate = true
    // this.newsArticle = (this.test as any)['article']
    this.timelineService.searchNews(this.searchNewsText).subscribe((res) => {
      this.newsActivate = true
      this.newsArticle = (res as any)['article']
      console.log(this.newsArticle)
    })
  }

  displayTimeline() {
    this.timelineClicked = true;
    this.timelineActivate = true;
    this.leftState = 'visible';
    this.rightState = 'visible';
    this.timelineService.getTimelineNews(this.searchNewsText).subscribe((res) => {
      this.newsTimelineActicles = (res as any)
      console.log(this.newsTimelineActicles)
    })
  }
  
  animateMove() {
    this.moveState = this.moveState === 'initial' ? 'moved' : 'initial';
    this.containerState = this.containerState === 'initial' ? 'expanded' : 'initial';
  }

  animateLeftRight() {
    this.leftState = 'visible';
    this.rightState = 'visible';
  }

  // @Output() animate = new EventEmitter<void>();

  // triggerAnimation() {
  //   this.animate.emit();
  // }
}
