import { Component } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup,  Validators } from '@angular/forms';
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

      if (this.loginForm.controls.userName.value == 'asd' && this.loginForm.controls.password.value == 'asd') {

      }
    }

    constructor(private fb: UntypedFormBuilder) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [ null, [ Validators.required ] ],
            password: [ null, [ Validators.required ] ]
        });
    }
}
