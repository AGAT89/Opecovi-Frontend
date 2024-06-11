import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { TableService } from 'src/app/shared/services/table.service';

interface DataItem {
  id: number;
  nombres: string;
  apellido_paterno: string;
  tipo_persona: string;
  documento_identidad: string;
  telefono:  string;
}

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

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
        title: 'Acciones'
    }
  ]

  productsList = []

  isVisible = false;
  isOkLoading = false;

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

  auxIdPersona : number = 0;

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;

    this.validateFormPerson = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
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
    this.listarPersonas();
    this.validateFormPerson.controls.es_empleado.setValue('0');
        this.validateFormPerson.controls.es_proveedor.setValue('0');
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  showModal(tipo: string, persona? : any): void {
    if (tipo == 'nuevo') {
      this.isVisible = true;
      this.auxIdPersona = 0;
    } else {
      console.log(persona);
      this.auxIdPersona = persona.id_persona;
      this.validateFormPerson.controls.id_empresa.setValue(persona.id_empresa);
      this.validateFormPerson.controls.tipo_persona.setValue(persona.tipo_persona);
      this.validateFormPerson.controls.tipo_documento.setValue(persona.tipo_documento);
      this.validateFormPerson.controls.documento_identidad.setValue(persona.documento_identidad);
      this.validateFormPerson.controls.apellido_paterno.setValue(persona.apellido_paterno);
      this.validateFormPerson.controls.apellido_materno.setValue(persona.apellido_materno);
      this.validateFormPerson.controls.nombres.setValue(persona.nombres);
      this.validateFormPerson.controls.direccion.setValue(persona.direccion);
      this.validateFormPerson.controls.ubigeo.setValue(persona.ubigeo);
      this.validateFormPerson.controls.telefono.setValue(persona.telefono);
      this.validateFormPerson.controls.es_empleado.setValue(persona.es_empleado);
      this.validateFormPerson.controls.es_proveedor.setValue(persona.es_proveedor);
      this.isVisible = true;
    }
  }

  handleOk(): void {

    if (this.auxIdPersona == 0) {
      this.isOkLoading = true;
      this.validateFormPerson.controls.id_empresa.setValue('1');

      this.api.consulta('personas', 'post', this.validateFormPerson.value).subscribe((resp) => {


        this.isVisible = false;
        this.isOkLoading = false;
        this.validateFormPerson.reset();
        this.ngOnInit();

      });
    } else {
      this.isOkLoading = true;

      this.api.consulta('personas/'+this.auxIdPersona, 'put', this.validateFormPerson.value).subscribe((resp) => {

         this.isVisible = false;
          this.isOkLoading = false;
          this.validateFormPerson.reset();
          this.ngOnInit();


      });
    }


  }

  handleCancel(): void {
    this.isVisible = false;
  }

  buscarNumeroDocumento(){
    if (this.validateFormPerson.controls.documento_identidad.value.length == 8) {
      this.api.consultaApiPeru('NATURAL', {'dni' : this.validateFormPerson.controls.documento_identidad.value}).subscribe((resp) => {

        this.validateFormPerson.controls.tipo_persona.setValue('NATURAL');
        this.validateFormPerson.controls.tipo_documento.setValue('DNI');
        this.validateFormPerson.controls.apellido_paterno.setValue(resp.data.apellido_paterno);
        this.validateFormPerson.controls.apellido_materno.setValue(resp.data.apellido_materno);
        this.validateFormPerson.controls.nombres.setValue(resp.data.nombres);
        this.validateFormPerson.controls.ubigeo.setValue(resp.data.ubigeo[2]);
        this.validateFormPerson.controls.telefono.setValue('');
        this.validateFormPerson.controls.direccion.setValue(resp.data.direccion);
        this.validateFormPerson.controls.es_empleado.setValue('0');
        this.validateFormPerson.controls.es_proveedor.setValue('0');
      });
    } else {

      this.api.consultaApiPeru('JURIDICA', {'ruc' : this.validateFormPerson.controls.documento_identidad.value}).subscribe((resp) => {

        this.validateFormPerson.controls.tipo_persona.setValue('JURIDICA');
        this.validateFormPerson.controls.tipo_documento.setValue('RUC');
        this.validateFormPerson.controls.apellido_paterno.setValue('');
        this.validateFormPerson.controls.apellido_materno.setValue('');
        this.validateFormPerson.controls.nombres.setValue(resp.data.nombre_o_razon_social);
        this.validateFormPerson.controls.ubigeo.setValue(resp.data.ubigeo[2]);
        this.validateFormPerson.controls.telefono.setValue('');
        this.validateFormPerson.controls.direccion.setValue(resp.data.direccion);
        this.validateFormPerson.controls.es_empleado.setValue('0');
        this.validateFormPerson.controls.es_proveedor.setValue('0');
      });
    }
  }

  listarPersonas(){
    this.api.consulta('personas', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }



  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar ah este persona?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarPersona(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarPersona(id: any) {
    this.api.consulta('personas/'+id, 'delete').subscribe((resp) => {

      this.ngOnInit();
    });
  }

}
