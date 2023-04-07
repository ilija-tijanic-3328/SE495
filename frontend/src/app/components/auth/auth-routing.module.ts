import {inject, NgModule} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {guestGuard} from "../../app-routing.module";
import {LogoutComponent} from "./logout.component";
import {AuthService} from "../../services/auth.service";

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
            path: 'two-factor',
            loadChildren: () => import('./twofactor/two-factor.module').then(m => m.TwoFactorModule),
            canActivate: [twoFactorGuard]
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

export function twoFactorGuard() {
    let waitingForCode = inject(AuthService).isWaitingFor2FactorCode();
    let router = inject(Router);
    return waitingForCode ? true : router.navigate(['/landing']);
}
