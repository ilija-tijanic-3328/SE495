import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)},
        {path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule)},
        {path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)},
        {
            path: 'forgot-password',
            loadChildren: () => import('./forgotpassword/forgot-password.module').then(m => m.ForgotPasswordModule)
        },
        {
            path: 'reset-password',
            loadChildren: () => import('./resetpassword/reset-password.module').then(m => m.ResetPasswordModule)
        },
        {path: '**', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)}
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
