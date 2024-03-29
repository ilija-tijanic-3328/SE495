import {inject, NgModule} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {guestGuard} from "../../app-routing.module";
import {LogoutComponent} from "./logout.component";
import {AuthService} from "../../services/auth.service";
import {ConfirmComponent} from "./confirm.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)},
        {path: 'access-denied', loadChildren: () => import('./access/access.module').then(m => m.AccessModule)},
        {
            path: 'register',
            title: 'Quick Quiz Ninja - Register',
            loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
            canActivate: [guestGuard]
        },
        {
            path: 'forgot-password',
            title: 'Quick Quiz Ninja - Forgot Password',
            loadChildren: () => import('./forgotpassword/forgot-password.module').then(m => m.ForgotPasswordModule),
            canActivate: [guestGuard]
        },
        {
            path: 'reset-password',
            title: 'Quick Quiz Ninja - Reset Password',
            loadChildren: () => import('./resetpassword/reset-password.module').then(m => m.ResetPasswordModule),
            canActivate: [guestGuard]
        },
        {
            path: 'two-factor',
            title: 'Quick Quiz Ninja - Two Factor Login',
            loadChildren: () => import('./twofactor/two-factor.module').then(m => m.TwoFactorModule),
            canActivate: [twoFactorGuard]
        },
        {
            path: 'logout',
            component: LogoutComponent
        },
        {
            path: 'confirm',
            component: ConfirmComponent,
            canActivate: [guestGuard]
        },
        {
            path: '**',
            title: 'Quick Quiz Ninja - Login',
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
