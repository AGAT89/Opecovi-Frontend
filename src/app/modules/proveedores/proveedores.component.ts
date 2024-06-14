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
  giro_negocio:  string;
}

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

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
        title: 'Giro de negocio',
        compare: (a: DataItem, b: DataItem) => a.giro_negocio.localeCompare(b.giro_negocio)
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

  validateFormProveedor: FormGroup<{
    id_empresa: FormControl<string>;
    id_persona: FormControl<string>;
    giro_negocio: FormControl<string>;

  }>;

  auxIdProveedor : number = 0;

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

    this.validateFormProveedor = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_persona: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      giro_negocio: ['', [Validators.required]],
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
    this.listarProveedores();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }



  showModal(tipo: string, proveedor? : any): void {
    if (tipo == 'nuevo') {
      this.isVisible = true;
      this.auxIdProveedor = 0;
    } else {

      this.auxIdProveedor = proveedor.id_proveedor;

      this.validateFormPerson.controls.id_empresa.setValue(proveedor.persona.id_empresa);
      this.validateFormPerson.controls.tipo_persona.setValue(proveedor.persona.tipo_persona);
      this.validateFormPerson.controls.tipo_documento.setValue(proveedor.persona.tipo_documento);
      this.validateFormPerson.controls.documento_identidad.setValue(proveedor.persona.documento_identidad);
      this.validateFormPerson.controls.apellido_paterno.setValue(proveedor.persona.apellido_paterno);
      this.validateFormPerson.controls.apellido_materno.setValue(proveedor.persona.apellido_materno);
      this.validateFormPerson.controls.nombres.setValue(proveedor.persona.nombres);
      this.validateFormPerson.controls.direccion.setValue(proveedor.persona.direccion);
      this.validateFormPerson.controls.ubigeo.setValue(proveedor.persona.ubigeo);
      this.validateFormPerson.controls.telefono.setValue(proveedor.persona.telefono);
      this.validateFormPerson.controls.es_empleado.setValue(proveedor.persona.es_empleado);
      this.validateFormPerson.controls.es_proveedor.setValue(proveedor.persona.es_proveedor);

      this.validateFormProveedor.controls.id_empresa.setValue(proveedor.id_empresa);
      this.validateFormProveedor.controls.id_persona.setValue(proveedor.id_persona);
      this.validateFormProveedor.controls.giro_negocio.setValue(proveedor.giro_negocio);

      this.isVisible = true;
    }
  }

  handleOk(): void {

    if (this.auxIdProveedor == 0) {
      this.isOkLoading = true;
      this.validateFormProveedor.controls.id_empresa.setValue('1');

      this.api.consulta('proveedores', 'post', this.validateFormProveedor.value).subscribe((resp) => {


        this.isVisible = false;
        this.isOkLoading = false;
        this.validateFormPerson.reset();
        this.validateFormProveedor.reset();
        this.ngOnInit();

      });
    } else {
      this.isOkLoading = true;

      this.api.consulta('proveedores/'+this.auxIdProveedor, 'put', this.validateFormProveedor.value).subscribe((resp) => {

         this.isVisible = false;
          this.isOkLoading = false;
          this.validateFormPerson.reset();
          this.validateFormProveedor.reset();
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

        this.validateFormProveedor.controls.id_persona.setValue(resp.data.id_persona);
    });

  }

  listarProveedores(){
    this.api.consulta('proveedores', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }

  girosNegocio = [
    { codigo: '001', nombre: 'Bebidas' },
    { codigo: '002', nombre: 'Estanteria' },
    { codigo: '003', nombre: 'Impresiones' },
    { codigo: '004', nombre: 'Insumos Operativos' },
    { codigo: '005', nombre: 'Libreria' },
    { codigo: '006', nombre: 'Limpieza' },
    { codigo: '007', nombre: 'Papeleria' },
    { codigo: '008', nombre: 'Seguros' },
    { codigo: '009', nombre: 'Tecnología' },
    { codigo: '010', nombre: 'Telefonia' },
    { codigo: '011', nombre: 'Uniformes' }
  ];

  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar ah este proveedor?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarProveedores(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarProveedores(id: any) {
    this.api.consulta('proveedores/'+id, 'delete').subscribe((resp) => {

      this.ngOnInit();
    });
  }

}
