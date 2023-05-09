import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LeaderboardComponent} from "./leaderboard.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: LeaderboardComponent, title: 'Quiz Leaderboard'},
        {path: ':code', component: LeaderboardComponent, title: 'Quiz Leaderboard'},
    ])],
    exports: [RouterModule]
})
export class LeaderboardRoutingModule {
}
