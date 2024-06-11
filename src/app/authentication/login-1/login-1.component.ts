import { Component } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import {  } from "module";


@Component({
    templateUrl: './login-1.component.html'
})

export class Login1Component {
    loginForm: UntypedFormGroup;

    submitForm(): void {
      console.log(this.loginForm.controls.userName.value);
      console.log(this.loginForm.controls.password.value);
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[ i ].markAsDirty();
            this.loginForm.controls[ i ].updateValueAndValidity();
        }

      if (this.loginForm.controls.userName.value == 'aarias' && this.loginForm.controls.password.value == '123456') {
        this.router.navigate(['roles']);
      }
    }

    constructor(private fb: UntypedFormBuilder, private router: Router) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [ null, [ Validators.required ] ],
            password: [ null, [ Validators.required ] ]
        });
    }
}
