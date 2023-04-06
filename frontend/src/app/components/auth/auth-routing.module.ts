import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {guestGuard} from "../../app-routing.module";
import {LogoutComponent} from "./logout.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)},
        {path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule)},
        {
            path: 'register',
            loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
            canActivate: [guestGuard]
        },
        {
            path: 'forgot-password',
            loadChildren: () => import('./forgotpassword/forgot-password.module').then(m => m.ForgotPasswordModule),
            canActivate: [guestGuard]
        },
        {
            path: 'reset-password',
            loadChildren: () => import('./resetpassword/reset-password.module').then(m => m.ResetPasswordModule),
            canActivate: [guestGuard]
        },
        {
            path: 'logout',
            component: LogoutComponent
        },
        {
            path: '**',
            loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
            canActivate: [guestGuard]
        }
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
