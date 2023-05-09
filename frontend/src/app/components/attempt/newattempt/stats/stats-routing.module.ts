import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StatsComponent} from "./stats.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: StatsComponent, title: 'Quiz Stats'},
        {path: ':code', component: StatsComponent, title: 'Quiz Stats'},
    ])],
    exports: [RouterModule]
})
export class StatsRoutingModule {
}
