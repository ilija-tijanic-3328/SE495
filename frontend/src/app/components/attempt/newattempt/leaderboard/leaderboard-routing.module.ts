import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LeaderboardComponent} from "./leaderboard.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: LeaderboardComponent},
        {path: ':code', component: LeaderboardComponent},
    ])],
    exports: [RouterModule]
})
export class LeaderboardRoutingModule {
}
