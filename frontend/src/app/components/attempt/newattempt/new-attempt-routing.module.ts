import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NewAttemptComponent} from "./new-attempt.component";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: ':code/results',
            title: 'QuickQuiz.Ninja - Results',
            loadChildren: () => import('./attemptresult/attempt-result.module').then(m => m.AttemptResultModule)
        },
        {path: ':quizId/leaderboard', component: NewAttemptComponent},
        {path: ':quizId/stats', component: NewAttemptComponent},
        {path: ':code', component: NewAttemptComponent},
        {path: '', component: NewAttemptComponent},
    ])],
    exports: [RouterModule]
})
export class NewAttemptRoutingModule {
}
