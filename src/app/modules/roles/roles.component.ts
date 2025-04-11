import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { TableService } from 'src/app/shared/services/table.service';

interface DataItem {
  id: number;
  nomb_rol: string;
  es_activo: string;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  selectedCategory: string;
  selectedStatus: string;
  searchInput: any;
  displayData = [];

  orderColumn = [
    {
        title: 'ID',
        compare: (a: DataItem, b: DataItem) => a.id - b.id,
    },
    {
        title: 'Rol',
        compare: (a: DataItem, b: DataItem) => a.nomb_rol.localeCompare(b.nomb_rol)
    },
    {
        title: 'Estado',
        compare: (a: DataItem, b: DataItem) => a.es_activo.localeCompare(b.es_activo)
    },
    {
        title: 'Acciones'
    }
  ]

  productsList = []

  isVisible = false;
  isOkLoading = false;

  validateFormRol: FormGroup<{
    id_empresa: FormControl<string>;
    nomb_rol: FormControl<string>;
  }>;

  auxIdRol : number = 0;

  modulos: any[] = [];
  permisos: any[] = [];
  permisosActuales: any[] = [];

  listOfOption: string[] = [];

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;

    this.validateFormRol = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      nomb_rol: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listarRoles();
    this.listarModulos();

  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  showModal(tipo: string, rol? : any): void {
    if (tipo == 'nuevo') {
      this.isVisible = true;
      this.auxIdRol = 0;
    } else {
      console.log(rol);
      this.auxIdRol = rol.id_rol;
      this.validateFormRol.controls.id_empresa.setValue(rol.id_empresa);
      this.validateFormRol.controls.nomb_rol.setValue(rol.nomb_rol);

      rol.permisos.forEach(element => {
        if (element.es_activo == 1 || element.es_activo == '1') {
          this.permisos.push(element.id_modulo);
          this.permisosActuales.push(element.id_permisos);
        }
      });

      this.isVisible = true;
    }
  }

  handleOk(): void {
    if (this.auxIdRol == 0) {
      this.isOkLoading = true;
      this.validateFormRol.controls.id_empresa.setValue('1');

      this.api.consulta('roles', 'post', this.validateFormRol.value).subscribe((resp) => {

        this.permisos.forEach(element => {
          let permiso = {
            id_empresa : 1,
            id_rol: resp.data.id_rol,
            id_modulo : element
          };
          this.api.consulta('permisos','post', permiso).subscribe((res) => {
            console.log(res);
          })
        });

        this.isVisible = false;
        this.isOkLoading = false;

        this.ngOnInit();
        this.permisos = []
        this.permisosActuales = [];
        this.validateFormRol.reset();

      });
    } else {
      this.isOkLoading = true;

      this.api.consulta('roles/'+this.auxIdRol, 'put', this.validateFormRol.value).subscribe((resp) => {

        this.permisosActuales.forEach(element => {
          this.api.consulta('permisos/'+element,'delete').subscribe((res)=>{
            console.log(res);
          })
        });

        this.permisos.forEach(element => {
          let permiso = {
            id_empresa : 1,
            id_rol: resp.data.id_rol,
            id_modulo : element
          };
          this.api.consulta('permisos','post', permiso).subscribe((res) => {
            console.log(res);
          })
        });

         this.isVisible = false;
          this.isOkLoading = false;

          this.ngOnInit();

        this.permisos = []
        this.permisosActuales = [];
          this.validateFormRol.reset();


      });
    }


  }

  handleCancel(): void {
    this.isVisible = false;
  }



  listarRoles(){
    this.api.consulta('roles', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }

  listarModulos(){
    this.api.consulta('modulos', 'get').subscribe((resp) => {

      this.modulos = resp.data;
    });
  }

  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar este rol?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarRol(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarRol(id: any) {
    this.api.consulta('roles/'+id, 'delete').subscribe((resp) => {

      this.ngOnInit();
    });
  }
}
