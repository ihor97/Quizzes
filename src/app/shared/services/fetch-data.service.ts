import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map,tap, forkJoin,BehaviorSubject  } from 'rxjs';
import { IQuestion } from '../interfaces/question.interface';
import { randomizer } from '../utilities/util';
import { ManageDataService } from './manage-data.service';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {
  private readonly MIN_QUESTIONS = 5
  private readonly MAX_QUESTIONS = 10
  constructor(private _http: HttpClient,private manageDataSrv:ManageDataService) {
    this.getCategoriesID()
  }

  private getCategoriesID() {
    return this._http.get<{ [key: string]: { id: number, name: string }[] }>('https://opentdb.com/api_category.php')
      .pipe(map(
        res => {
          let categoryIDs = []
          res['trivia_categories'].forEach((val, index) => {
            categoryIDs.push(val.id)
          })
          return categoryIDs
        }
      ))
  }


  private getRandomQuizz() {

    return this.getCategoriesID().pipe(

      exhaustMap(result => {
        const randomQuestionsQuantity = randomizer(this.MIN_QUESTIONS, this.MAX_QUESTIONS)
        const randomCategory = randomizer(result[0], result[result.length - 1])
        return this._http.get(`https://opentdb.com/api.php?amount=${randomQuestionsQuantity}&category=${randomCategory}`)
      })
      ,
      map(response => {
        return response['results'].map((val) => {
          return { category: val['category'], correct_answer: val['correct_answer'], question: val['question'], incorrect_answers: val['incorrect_answers'] }
        })
      })

    )

  }

  fetchQuizzes(count: number) {
    console.log(1);
    
    const stream$ = []
    for (let i = 0; i < count; i++) {
      stream$.push(this.getRandomQuizz())
    }
    return forkJoin(stream$).pipe(tap(
      (result) => {
        
        console.log(result);
        
      this.manageDataSrv.setQuizzes(result)
      this.manageDataSrv.nextQuizzes.next(result)
      }
    ))
  }
}
