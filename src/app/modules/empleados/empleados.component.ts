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
  name: string;
  category: string;
  price: number;
  quantity: number;
  status:  string;
}

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  numero_documento : String = '';

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
        compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
    },
    {
        title: 'Apellidos',
        compare: (a: DataItem, b: DataItem) => a.category.localeCompare(b.category)
    },
    {
        title: 'Tipo de Persona',
        compare: (a: DataItem, b: DataItem) => a.price - b.price,
    },
    {
        title: 'Documento',
        compare: (a: DataItem, b: DataItem) => a.quantity - b.quantity,
    },
    {
        title: 'Area - Cargo',
        compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
    },
    {
        title: 'Acciones'
    }
  ]

  productsList = [
   
  ]

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
    area_id: FormControl<string>;
    cargo_id: FormControl<string>;
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
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  areas: any[] = [];
  cargos: any[] =[];

  auxIdEmpleado : number = 0;
  auxIdPersona : number = 0;

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      nickname: ['', [Validators.required]],
      phoneNumberPrefix: '+86' as '+86' | '+87',
      phoneNumber: ['', [Validators.required]],
      website: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
      agree: [false]
    });

    this.validateFormPerson = this.fb.group({
      area_id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cargo_id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      tipo_persona: ['', [Validators.required]],
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
  }

  ngOnInit(): void {
    this.productsList = [];
    this.displayData = [];
    this.listarEmpleados();
    this.listarAreas();
    console.log(this.validateFormPerson);
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  categoryChange(value: string): void {
      const data = this.productsList
      value !== 'All'? this.displayData = data.filter(elm => elm.category === value) : this.displayData = data
  }

  statusChange(value: string): void {
      const data = this.productsList
      value !== 'All'? this.displayData = data.filter(elm => elm.status === value) : this.displayData = data
  }

  showModal(type: string, employee? : any): void {
    if (type == 'nuevo') {
      this.isVisible = true;
      this.auxIdEmpleado = 0;
    } else {
      console.log(employee);
      this.auxIdEmpleado = employee.id;
      this.auxIdPersona = employee.person.id;
      this.validateFormPerson.controls.area_id.setValue(employee.area_id);
      this.validateFormPerson.controls.cargo_id.setValue(employee.position_id);
      this.validateFormPerson.controls.tipo_persona.setValue(employee.person.tipo_persona);
      this.validateFormPerson.controls.tipo_documento.setValue(employee.person.tipo_documento);
      this.validateFormPerson.controls.documento_identidad.setValue(employee.person.documento_identidad);
      this.validateFormPerson.controls.apellido_paterno.setValue(employee.person.apellido_paterno);
      this.validateFormPerson.controls.apellido_materno.setValue(employee.person.apellido_materno);
      this.validateFormPerson.controls.nombres.setValue(employee.person.nombres);
      this.validateFormPerson.controls.direccion.setValue(employee.person.direccion);
      this.validateFormPerson.controls.ubigeo.setValue(employee.person.ubigeo);
      this.validateFormPerson.controls.telefono.setValue(employee.person.telefono);
      this.validateFormPerson.controls.es_empleado.setValue(employee.person.es_empleado);
      this.validateFormPerson.controls.es_proveedor.setValue(employee.person.es_proveedor);
      this.isVisible = true;

    }
  }

  handleOk(): void {

    if (this.auxIdEmpleado == 0) {
      this.isOkLoading = true;
      console.log(this.validateFormPerson.value);
      this.api.consulta('persons', 'post', this.validateFormPerson.value).subscribe((resp) => {
        console.log(resp);
        console.log({area_id: this.validateFormPerson.controls.area_id.value, people_id: resp.data.id, position_id: this.validateFormPerson.controls.cargo_id.value});
        this.api.consulta('employees', 'post', {area_id: this.validateFormPerson.controls.area_id.value, people_id: resp.data.id, position_id: this.validateFormPerson.controls.cargo_id.value}).subscribe((resp) => {
          this.isVisible = false;
          this.isOkLoading = false;

          this.ngOnInit();
        })


      });
    } else {
      this.isOkLoading = true;
      console.log(this.validateFormPerson.value);
      this.api.consulta('persons/'+this.auxIdPersona, 'put', this.validateFormPerson.value).subscribe((resp) => {
        console.log(resp);
        console.log({area_id: this.validateFormPerson.controls.area_id.value, people_id: this.auxIdPersona, position_id: this.validateFormPerson.controls.cargo_id.value});
        this.api.consulta('employees/'+this.auxIdEmpleado, 'put', {area_id: this.validateFormPerson.controls.area_id.value, people_id: this.auxIdPersona, position_id: this.validateFormPerson.controls.cargo_id.value}).subscribe((resp) => {
          this.isVisible = false;
          this.isOkLoading = false;

          this.ngOnInit();
        })


      });
    }

    // setTimeout(() => {
    //   this.isVisible = false;
    //   this.isOkLoading = false;
    // }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }


  //funciones apiPeru

  buscarNumeroDocumento(){
    console.log(this.validateFormPerson.controls.documento_identidad.value);
    console.log(this.validateFormPerson.controls.documento_identidad.value.length);
    if (this.validateFormPerson.controls.documento_identidad.value.length == 8) {
      // this.validateFormPerson.controls.tipo_persona.setValue('NATURAL');
      this.api.consultaApiPeru('NATURAL', {'dni' : this.validateFormPerson.controls.documento_identidad.value}).subscribe((resp) => {
        console.log(resp);
        this.validateFormPerson.controls.tipo_persona.setValue('NATURAL');
        this.validateFormPerson.controls.tipo_documento.setValue('DNI');
        this.validateFormPerson.controls.apellido_paterno.setValue(resp.data.apellido_paterno);
        this.validateFormPerson.controls.apellido_materno.setValue(resp.data.apellido_materno);
        this.validateFormPerson.controls.nombres.setValue(resp.data.nombres);
        this.validateFormPerson.controls.ubigeo.setValue(resp.data.ubigeo[2]);
        this.validateFormPerson.controls.telefono.setValue('');
        this.validateFormPerson.controls.direccion.setValue(resp.data.direccion);
        this.validateFormPerson.controls.es_empleado.setValue('1');
        this.validateFormPerson.controls.es_proveedor.setValue('0');
      });
    } else {
      // this.validateFormPerson.controls.tipo_persona.setValue('JURIDICA');
      this.api.consultaApiPeru('JURIDICA', {'ruc' : this.validateFormPerson.controls.documento_identidad.value}).subscribe((resp) => {
        console.log(resp);
        this.validateFormPerson.controls.tipo_persona.setValue('JURIDICA');
        this.validateFormPerson.controls.tipo_documento.setValue('RUC');
        this.validateFormPerson.controls.apellido_paterno.setValue('');
        this.validateFormPerson.controls.apellido_materno.setValue('');
        this.validateFormPerson.controls.nombres.setValue(resp.data.nombre_o_razon_social);
        this.validateFormPerson.controls.ubigeo.setValue(resp.data.ubigeo[2]);
        this.validateFormPerson.controls.telefono.setValue('');
        this.validateFormPerson.controls.direccion.setValue(resp.data.direccion);
        this.validateFormPerson.controls.es_empleado.setValue('1');
        this.validateFormPerson.controls.es_proveedor.setValue('0');
      });
    }
  }

  listarEmpleados(){
    this.api.consulta('employees', 'get').subscribe((resp) => {
      console.log(resp);
      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }

  listarAreas(){
    this.api.consulta('areas', 'get').subscribe((resp) => {
      this.areas = resp.data;
      console.log(this.areas);
    });
  }

  selectArea(): void {
    this.api.consulta('positions-for-area/'+this.validateFormPerson.controls.area_id.value, 'get').subscribe((resp) => {
      console.log(resp);
      this.cargos = resp.data;
    })
  }

  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar ah este empleado?',
      // nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarEmpleado(id),//console.log('OK'),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarEmpleado(id: any) {
    this.api.consulta('employees/'+id, 'delete').subscribe((resp) => {
      console.log(resp);
      this.ngOnInit();
    });
  }
}
