import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Login1Component } from './login-1/login-1.component';

import { SignUp1Component } from './sign-up-1/sign-up-1.component';

import { Error1Component } from './error-1/error-1.component';


const routes: Routes = [
    {
        path: 'login-1',
        component: Login1Component,
        data: {
            title: 'Login 1'
        }
    },
    {
        path: 'sign-up-1',
        component: SignUp1Component,
        data: {
            title: 'Sign Up 1'
        }
    },
    {
        path: 'error-1',
        component: Error1Component,
        data: {
            title: 'Error 1'
        }
    }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule { }
