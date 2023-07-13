import { ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ManageDataService } from 'src/app/shared/services/manage-data.service';
import { randomizer } from 'src/app/shared/utilities/util';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements OnInit {
  quizz = []
  quizzIterator: any
  question: string = null
  answerArray: Array<string> = []
  indexOfQuestion = 0
  isFinish = false
  start: Date
  
  @ViewChild('form') form: NgForm

  constructor(private actRoute: ActivatedRoute, private dataSrv: ManageDataService, private router: Router) { }
  ngOnInit(): void {
    this.fetchQuizz()
  }

  fetchQuizz() {
    this.actRoute.params.pipe(
      map(v => v['id']),
      switchMap(id => this.dataSrv.getOneQuizz(+id)),
    )
      .subscribe(
        (q) => {
          this.quizz = q.slice()
          this.quizzIterator = this.createGenarator(this.quizz)
          this.nextQuestion()
          this.start = new Date()
        }
      )
  }

  nextQuestion() {
    console.log(this.isFinish);

    let currentIterator = this.quizzIterator.next()


    let currentQuestion = currentIterator.value

    if (currentQuestion) {

      this.question = currentQuestion.question
      let arrLength = currentQuestion.incorrect_answers.length
      let randomPosition = randomizer(0, arrLength)

      this.answerArray = currentQuestion.incorrect_answers
      this.answerArray.splice(randomPosition, 0, currentQuestion.correct_answer)

    } else {
      console.log(this.quizz);
      this.dataSrv.storeComplitedQuizz(this.quizz)
      this.dataSrv.time.next((new Date()).getTime() - this.start.getTime())
      this.router.navigate(['/finish'])

    }



  }

  *createGenarator(arg) {
    for (let i = 0; i < arg.length; i++) {
      yield arg[i]
    }
  }


  sumbitAnswer() {
    this.quizz[this.indexOfQuestion].isAnswerCorrect = this.quizz[this.indexOfQuestion].correct_answer === this.form.value.answer
    this.indexOfQuestion++
    this.nextQuestion()
    this.form.reset()
  }

  quitQuizz() {
    this.router.navigate(['/'])
  }



}
