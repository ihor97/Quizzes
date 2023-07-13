import { Component, OnDestroy, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManageDataService } from 'src/app/shared/services/manage-data.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class FinishComponent implements OnInit, OnDestroy {
  subscription: Subscription
  time: number
  correctAnswers: number=0
  constructor(private dataSrv: ManageDataService) { }

  ngOnInit(): void {
    this.subscription = this.dataSrv.time.subscribe(
      t => {
        this.time = t
      }
    )
      this.correctAnswers=this.dataSrv.completedQuizzes[this.dataSrv.completedQuizzes.length-1].filter(val=>val.isAnswerCorrect).length

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
