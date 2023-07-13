export interface IQuestion{
    category:string;
    correct_answer:string;
    question:string;
    incorrect_answers:string;
    isAnswerCorrect?:boolean
}