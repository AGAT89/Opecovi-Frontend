import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ApiService } from 'src/app/shared/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';

interface DataItem {
  id: number;
  nombres: string;
  apellido_paterno: string;
  tipo_persona: string;
  documento_identidad: string;
  telefono:  string;
  area:  string;
  cargo:  string;
}

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

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
        compare: (a: DataItem, b: DataItem) => a.apellido_paterno.localeCompare(b.apellido_paterno)
    },
    {
        title: 'Tipo de Persona',
        compare: (a: DataItem, b: DataItem) => a.tipo_persona.localeCompare(b.tipo_persona)
    },
    {
        title: 'Documento',
        compare: (a: DataItem, b: DataItem) => a.documento_identidad.localeCompare(b.documento_identidad)
    },
    {
        title: 'Telefono',
        compare: (a: DataItem, b: DataItem) => a.telefono.localeCompare(b.telefono)
    },
    {
        title: 'Area',
        compare: (a: DataItem, b: DataItem) => a.area.localeCompare(b.area)
    },
    {
        title: 'Cargo',
        compare: (a: DataItem, b: DataItem) => a.cargo.localeCompare(b.cargo)
    },
    {
        title: 'Acciones'
    }
  ]

  productsList = []

  isVisible = false;
  isOkLoading = false;

  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    nickname: FormControl<string>;
    phoneNumberPrefix: FormControl<'+86' | '+87'>;
    phoneNumber: FormControl<string>;
    website: FormControl<string>;
    captcha: FormControl<string>;
    agree: FormControl<boolean>;
  }>;

  validateFormPerson: FormGroup<{
    id_empresa: FormControl<string>;
    tipo_persona: FormControl<string>;
    tipo_documento: FormControl<string>;
    documento_identidad: FormControl<string>;
    apellido_paterno: FormControl<string>;
    apellido_materno: FormControl<string>;
    nombres: FormControl<string>;
    direccion: FormControl<string>;
    ubigeo: FormControl<string>;
    telefono: FormControl<string>;
    es_empleado: FormControl<string>;
    es_proveedor: FormControl<string>;
  }>;

  validateFormEmpleado: FormGroup<{
    id_empresa: FormControl<string>;
    id_persona: FormControl<string>;
    id_area: FormControl<string>;
    id_cargo: FormControl<string>;
  }>;

  areas: any[] = [];
  cargos: any[] =[];

  auxIdEmpleado : number = 0;

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;

    this.validateFormPerson = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      tipo_persona: ['', [Validators.required,]],
      tipo_documento: ['', [Validators.required]],
      documento_identidad: ['', [Validators.required]],
      apellido_paterno: ['', [Validators.required]],
      apellido_materno: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      ubigeo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      es_empleado: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      es_proveedor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });

    this.validateFormEmpleado = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_persona: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_area: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_cargo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });

    this.validateFormPerson.get('tipo_persona')?.disable();
    this.validateFormPerson.get('tipo_documento')?.disable();
    this.validateFormPerson.get('apellido_paterno')?.disable();
    this.validateFormPerson.get('apellido_materno')?.disable();
    this.validateFormPerson.get('nombres')?.disable();
    this.validateFormPerson.get('direccion')?.disable();
    this.validateFormPerson.get('ubigeo')?.disable();
    this.validateFormPerson.get('telefono')?.disable();
  }

  ngOnInit(): void {
    this.listarEmpleados();
    this.listarAreas();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }



  showModal(tipo: string, empleado? : any): void {
    if (tipo == 'nuevo') {
      this.isVisible = true;
      this.auxIdEmpleado = 0;
    } else {

      this.auxIdEmpleado = empleado.id_empleado;

      this.validateFormPerson.controls.id_empresa.setValue(empleado.persona.id_empresa);
      this.validateFormPerson.controls.tipo_persona.setValue(empleado.persona.tipo_persona);
      this.validateFormPerson.controls.tipo_documento.setValue(empleado.persona.tipo_documento);
      this.validateFormPerson.controls.documento_identidad.setValue(empleado.persona.documento_identidad);
      this.validateFormPerson.controls.apellido_paterno.setValue(empleado.persona.apellido_paterno);
      this.validateFormPerson.controls.apellido_materno.setValue(empleado.persona.apellido_materno);
      this.validateFormPerson.controls.nombres.setValue(empleado.persona.nombres);
      this.validateFormPerson.controls.direccion.setValue(empleado.persona.direccion);
      this.validateFormPerson.controls.ubigeo.setValue(empleado.persona.ubigeo);
      this.validateFormPerson.controls.telefono.setValue(empleado.persona.telefono);
      this.validateFormPerson.controls.es_empleado.setValue(empleado.persona.es_empleado);
      this.validateFormPerson.controls.es_proveedor.setValue(empleado.persona.es_proveedor);

      this.validateFormEmpleado.controls.id_empresa.setValue(empleado.id_empresa);
      this.validateFormEmpleado.controls.id_persona.setValue(empleado.id_persona);
      this.validateFormEmpleado.controls.id_area.setValue(empleado.id_area);
      this.validateFormEmpleado.controls.id_cargo.setValue(empleado.id_cargo);

      this.isVisible = true;
    }
  }

  handleOk(): void {

    if (this.auxIdEmpleado == 0) {
      this.isOkLoading = true;
      this.validateFormEmpleado.controls.id_empresa.setValue('1');

      this.api.consulta('empleados', 'post', this.validateFormEmpleado.value).subscribe((resp) => {


        this.isVisible = false;
        this.isOkLoading = false;
        this.validateFormEmpleado.reset();
        this.validateFormPerson.reset();
        this.ngOnInit();

      });
    } else {
      this.isOkLoading = true;

      this.api.consulta('empleados/'+this.auxIdEmpleado, 'put', this.validateFormEmpleado.value).subscribe((resp) => {

         this.isVisible = false;
          this.isOkLoading = false;
          this.validateFormEmpleado.reset();
          this.validateFormPerson.reset();
          this.ngOnInit();


      });
    }


  }

  handleCancel(): void {
    this.isVisible = false;
  }

  buscarNumeroDocumento(){
    this.api.consulta('busca-peronsa-documento/'+this.validateFormPerson.controls.documento_identidad.value, 'get').subscribe((resp)=>{
      console.log(resp);
        this.validateFormPerson.controls.id_empresa.setValue(resp.data.id_empresa);
        this.validateFormPerson.controls.tipo_persona.setValue(resp.data.tipo_persona);
        this.validateFormPerson.controls.tipo_documento.setValue(resp.data.tipo_documento);
        this.validateFormPerson.controls.apellido_paterno.setValue(resp.data.apellido_paterno);
        this.validateFormPerson.controls.apellido_materno.setValue(resp.data.apellido_materno);
        this.validateFormPerson.controls.nombres.setValue(resp.data.nombres);
        this.validateFormPerson.controls.ubigeo.setValue(resp.data.ubigeo);
        this.validateFormPerson.controls.telefono.setValue(resp.data.telefono);
        this.validateFormPerson.controls.direccion.setValue(resp.data.direccion);
        this.validateFormPerson.controls.es_empleado.setValue(resp.data.es_empleado);
        this.validateFormPerson.controls.es_proveedor.setValue(resp.data.es_proveedor);

        this.validateFormEmpleado.controls.id_persona.setValue(resp.data.id_persona);
    });

  }

  listarEmpleados(){
    this.api.consulta('empleados', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }

  listarAreas(){
    this.api.consulta('areas', 'get').subscribe((resp) => {

      this.areas = resp.data;
    });
  }

  listarCargos(){
    this.api.consulta('busca-cargo/'+this.validateFormEmpleado.controls.id_area.value, 'get').subscribe((resp) => {

      this.cargos = resp.data;
    });
  }

  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar este empleado?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarEmpleado(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarEmpleado(id: any) {
    this.api.consulta('empleados/'+id, 'delete').subscribe((resp) => {

      this.ngOnInit();
    });
  }
}
