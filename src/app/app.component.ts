import {  Component, OnDestroy, OnInit } from '@angular/core';
import { FetchDataService } from './shared/services/fetch-data.service';
import { ManageDataService } from './shared/services/manage-data.service';
import {Subscription} from 'rxjs'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit,OnDestroy  {
  
  constructor(private fetchSrv:FetchDataService,private manageDataSrv:ManageDataService){}


  ngOnInit(): void {
    
    if(localStorage.getItem('quizzes')){
      this.manageDataSrv.getQuizzesFromStorage()
    }else{
      this.fetchSrv.fetchQuizzes(10).subscribe()
    }
  }
  ngOnDestroy(): void {
  }
}
