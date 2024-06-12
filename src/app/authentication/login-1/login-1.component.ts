import { Component } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
//import {  } from "module";


@Component({
    templateUrl: './login-1.component.html'
})

export class Login1Component {
    loginForm: UntypedFormGroup;

    credenciales = false;

    submitForm(): void {
      console.log(this.loginForm.controls.userName.value);
      console.log(this.loginForm.controls.password.value);
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[ i ].markAsDirty();
            this.loginForm.controls[ i ].updateValueAndValidity();
        }

      // if (this.loginForm.controls.userName.value == 'aarias' && this.loginForm.controls.password.value == '123456') {
      //   this.router.navigate(['roles']);
      // }

      let body = {
        usuario: this.loginForm.controls.userName.value,
        password: this.loginForm.controls.password.value
      };

      this.api.consulta('auth/login', 'post', body).subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.credenciales = false;

          console.log(resp.data);

          // Convierte el objeto JSON a una cadena de texto
          const jsonString = JSON.stringify(resp.data);
          // Guarda la cadena de texto en localStorage
          localStorage.setItem('usuario', jsonString);
          let ruta: string = resp.data.rol.permisos[0].modulo.path;
          this.router.navigate([ruta]);
        } else {
          this.credenciales = true;
        }
      });
    }

    constructor(private fb: UntypedFormBuilder, private router: Router, private api: ApiService) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [ null, [ Validators.required ] ],
            password: [ null, [ Validators.required ] ]
        });
    }
}
