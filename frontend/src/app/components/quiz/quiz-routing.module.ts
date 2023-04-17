import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', loadChildren: () => import('./quizlist/quiz-list.module').then(m => m.QuizListModule)},
        {path: 'create', loadChildren: () => import('./createquiz/create-quiz.module').then(m => m.CreateQuizModule)},
    ])],
    exports: [RouterModule]
})
export class QuizRoutingModule {
}
