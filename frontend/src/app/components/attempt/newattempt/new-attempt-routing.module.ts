import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NewAttemptComponent} from "./new-attempt.component";
import {userGuard} from "../../../app-routing.module";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: ':code/results',
            title: 'QuickQuiz.Ninja - Quiz Results',
            loadChildren: () => import('./attemptresult/attempt-result.module').then(m => m.AttemptResultModule)
        },
        {
            path: ':quizId/leaderboard',
            title: 'QuickQuiz.Ninja - Quiz Leaderboard',
            loadChildren: () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardModule),
            canActivate: [userGuard]
        },
        {
            path: ':quizId/stats',
            title: 'QuickQuiz.Ninja - Quiz Stats',
            loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule),
            canActivate: [userGuard]
        },
        {path: ':code', component: NewAttemptComponent},
        {path: '', component: NewAttemptComponent},
    ])],
    exports: [RouterModule]
})
export class NewAttemptRoutingModule {
}
