import { ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ManageDataService } from 'src/app/shared/services/manage-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  quizzes = []
  loaded: boolean = false
  subscription: Subscription

  constructor(private dataSrv: ManageDataService, private router: Router) {

  }
  ngOnInit(): void {

    this.getQuizzes()
  }

  getQuizzes() {
    if (localStorage.getItem('quizzes')) {
      this.quizzes = JSON.parse(localStorage.getItem('quizzes'))
      this.loaded=true
    }
    this.subscription = this.dataSrv.nextQuizzes.subscribe(
      q => {
        this.quizzes = q
        this.loaded = true
      }
    )

  }

  getRandomQuizz() {
    const randomId = Math.floor(Math.random() * this.quizzes.length)
    this.router.navigate(['/play', randomId])
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
