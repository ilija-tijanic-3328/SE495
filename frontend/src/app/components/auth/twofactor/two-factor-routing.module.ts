import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TwoFactorComponent} from './two-factor.component';

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: TwoFactorComponent}
    ])],
    exports: [RouterModule]
})
export class TwoFactorRoutingModule {
}
