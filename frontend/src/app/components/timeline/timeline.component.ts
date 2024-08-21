import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

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

  searchNews() {
    this.newsActivate = true
    this.moveState = this.moveState === 'initial' ? 'moved' : 'initial';
    this.containerState = this.containerState === 'initial' ? 'expanded' : 'initial';
  }

  displayTimeline() {
    this.timelineClicked = true;
    this.timelineActivate = true;
    this.leftState = 'visible';
    this.rightState = 'visible';
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
