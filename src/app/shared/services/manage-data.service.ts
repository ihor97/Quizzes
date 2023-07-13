import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageDataService {
  public time= new BehaviorSubject<number>(null)
  public nextQuizzes= new Subject<any>()

  private randomQuizzes = []
  public completedQuizzes = []

  constructor() { }

  public getQuizzesFromStorage() {
    this.randomQuizzes = JSON.parse(localStorage.getItem('quizzes'))
    this.nextQuizzes.next(this.randomQuizzes)
  }

  public setQuizzes(quizzes){
    this.randomQuizzes=quizzes
   localStorage.setItem('quizzes',JSON.stringify(this.randomQuizzes))
  }
  
  public getOneQuizz(id: number) {
    return [this.randomQuizzes[id]]
  }

  public storeComplitedQuizz(quiz){
    this.completedQuizzes.push(quiz)
  }
}
