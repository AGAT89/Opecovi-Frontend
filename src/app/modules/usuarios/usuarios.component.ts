import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { TableService } from 'src/app/shared/services/table.service';

interface DataItem {
  id: number;
  nombres: string;
  apellidos: string;
  usuarios: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  selectedCategory: string;
  selectedStatus: string;
  searchInput: any;
  displayData = [];

  orderColumn = [
    {
        title: '#',
        compare: (a: DataItem, b: DataItem) => a.id - b.id,
    },
    {
        title: 'Nombres',
        compare: (a: DataItem, b: DataItem) => a.nombres.localeCompare(b.nombres)
    },
    {
        title: 'Apellidos',
        compare: (a: DataItem, b: DataItem) => a.apellidos.localeCompare(b.apellidos)
    },
    {
        title: 'Usuarios',
        compare: (a: DataItem, b: DataItem) => a.usuarios.localeCompare(b.usuarios)
    },
    {
        title: 'Acciones'
    }
  ]

  productsList = []

  isVisible = false;
  isOkLoading = false;

  validateFormUsuario: FormGroup<{
    id_empresa: FormControl<string>;
    id_empleado: FormControl<string>;
    id_rol: FormControl<string>;
    usuario: FormControl<string>;
    contrasena: FormControl<string>;
  }>;

  auxIdUsuario : number = 0;

  roles: any[]=[];
  empleados: any[]=[];

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;

    this.validateFormUsuario = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_empleado: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_rol: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarRoles();
    this.listarEmpleados();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  showModal(tipo: string, usuario? : any): void {
    if (tipo == 'nuevo') {
      this.isVisible = true;
      this.auxIdUsuario = 0;
    } else {
      console.log(usuario);
      this.auxIdUsuario = usuario.id_usuario;
      this.validateFormUsuario.controls.id_empresa.setValue(usuario.id_empresa);
      this.validateFormUsuario.controls.id_empleado.setValue(usuario.id_empleado);
      this.validateFormUsuario.controls.id_rol.setValue(usuario.id_rol);
      this.validateFormUsuario.controls.usuario.setValue(usuario.usuario);
      this.validateFormUsuario.controls.contrasena.setValue(usuario.contrasena);
      console.log(this.validateFormUsuario.value);
      this.isVisible = true;
    }
  }

  handleOk(): void {

    if (this.auxIdUsuario == 0) {
      this.isOkLoading = true;
      this.validateFormUsuario.controls.id_empresa.setValue('1');

      this.api.consulta('usuarios', 'post', this.validateFormUsuario.value).subscribe((resp) => {


        this.isVisible = false;
        this.isOkLoading = false;
        this.validateFormUsuario.reset();
        this.ngOnInit();

      });
    } else {
      this.isOkLoading = true;

      this.api.consulta('usuarios/'+this.auxIdUsuario, 'put', this.validateFormUsuario.value).subscribe((resp) => {

         this.isVisible = false;
          this.isOkLoading = false;
          this.validateFormUsuario.reset();
          this.ngOnInit();


      });
    }


  }

  handleCancel(): void {
    this.isVisible = false;
  }



  listarUsuarios(){
    this.api.consulta('usuarios', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }

  listarRoles(){
    this.api.consulta('roles', 'get').subscribe((resp) => {

      this.roles = resp.data;
    });
  }

  listarEmpleados(){
    this.api.consulta('empleados', 'get').subscribe((resp) => {

      this.empleados = resp.data;
    });
  }



  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar ah este usuario?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarUsuario(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarUsuario(id: any) {
    this.api.consulta('usuarios/'+id, 'delete').subscribe((resp) => {

      this.ngOnInit();
    });
  }

}
