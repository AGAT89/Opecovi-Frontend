import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { TableService } from 'src/app/shared/services/table.service';

interface DataItem {
  id_requerimiento: number;
  nro_requerimiento: string;
  sucursal: string;
  fecha: string;
  codigo_estado: string;
  empleado: string;
}

@Component({
  selector: 'app-requerimientos',
  templateUrl: './requerimientos.component.html',
  styleUrls: ['./requerimientos.component.css']
})
export class RequerimientosComponent implements OnInit {

  selectedCategory: string;
  selectedStatus: string;
  searchInput: any;
  displayData = [];
  auxIdRequerimiento : number = 0;
  sucursales: any[]=[];
  empleados: any[]=[];
  articulos: any[]=[];
  estadosDisponibles: any[] = []; 
  productsList = []
  isVisible = false;
  isOkLoading = false;

  orderColumn = [
    {
        title: '#',
        compare: (a: DataItem, b: DataItem) => a.id_requerimiento - b.id_requerimiento,
    },
    {
        title: 'Nro. requerimiento',
        compare: (a: DataItem, b: DataItem) => a.nro_requerimiento.localeCompare(b.nro_requerimiento)
    },
    {
        title: 'Sucursal',
        compare: (a: DataItem, b: DataItem) => a.sucursal.localeCompare(b.sucursal)
    },
    {
        title: 'Empleado solicitante',
        compare: (a: DataItem, b: DataItem) => a.empleado.localeCompare(b.empleado)
    },
    {
        title: 'Fecha creacion',
        compare: (a: DataItem, b: DataItem) => a.fecha.localeCompare(b.fecha)
    },
    {
        title: 'Estados',
        compare: (a: DataItem, b: DataItem) => a.codigo_estado.localeCompare(b.codigo_estado)
    },
    {
        title: 'Acciones'
    }
  ]

  validateFormReque: FormGroup<{
    id_requerimiento: FormControl<string>;
    nro_requerimiento: FormControl<string>;
    id_empresa: FormControl<string>;
    id_sucursal: FormControl<string>;
    id_empleado: FormControl<string>;
    id_empleado_aprobador: FormControl<string>;
    id_estados: FormControl<number>;
    detalle: FormControl<any[]>;
    cant_solicitada: FormControl<string>;
    id_articulo: FormControl<string>; 
  }>;

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService, private router: Router) {
    this.displayData = this.productsList;

    this.validateFormReque = this.fb.group({
      id_requerimiento: ['', [Validators.required,]],
      nro_requerimiento: ['', [Validators.required,]],
      id_empresa: ['', [Validators.required,]],
      id_sucursal: ['', [Validators.required]],
      id_empleado: ['', [Validators.required]],
      id_empleado_aprobador: ['', [Validators.required]],
      id_estados: [0, [Validators.required]],
      cant_solicitada:['', [Validators.required]],
      id_articulo:['', [Validators.required]],
      detalle:[]
    });
  }

  ngOnInit(): void {
    this.listarRequerimientos();
    this.listarSucursales();
    this.listarEmpleados();
    this.listarArticulos();
    this.listarEstados();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  showModal(tipo: string, item? : any): void {
    if (tipo == 'nuevo') {
      this.isVisible = true;
      this.auxIdRequerimiento = 0;
      this.validateFormReque.reset(); 
    } else {
      this.auxIdRequerimiento = item.id_requerimiento;
      this.validateFormReque.controls.nro_requerimiento.setValue(item.nro_requerimiento);
      this.validateFormReque.controls.id_empresa.setValue(item.id_empresa);
      this.validateFormReque.controls.id_sucursal.setValue(item.id_sucursal);
      this.validateFormReque.controls.id_empleado.setValue(item.id_empleado);

      const detalle = item.requerimientos_detalle?.[0];
      if (detalle) {
        this.validateFormReque.controls.id_articulo.setValue(detalle.id_articulo);
        this.validateFormReque.controls.cant_solicitada.setValue(detalle.cant_solicitada);
      }

      this.isVisible = true;
    }
  }

  handleOk(): void {
    this.isOkLoading = true;

    this.validateFormReque.patchValue({
      id_empresa: '1',
      id_requerimiento: '1',
      id_empleado_aprobador: '1',
      id_estados: 2,
      detalle: [{
        id_articulo: this.validateFormReque.controls.id_articulo.value,
        cant_solicitada: this.validateFormReque.controls.cant_solicitada.value
      }]
    });

    if (this.auxIdRequerimiento === 0) {
      this.api.consulta('requerimientos', 'post', this.validateFormReque.value).subscribe(() => {
        this.finalizarModal();
      });
    } else {
      this.api.consulta(`requerimientos/${this.auxIdRequerimiento}`, 'put', this.validateFormReque.value).subscribe(() => {
        this.finalizarModal();
      });
    }
  }

  finalizarModal(): void {
    this.isVisible = false;
    this.isOkLoading = false;
    this.ngOnInit();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  listarRequerimientos(){
    this.api.consulta('requerimientos', 'get').subscribe((resp) => {
      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }

  listarSucursales(){
    this.api.consulta('sucursales', 'get').subscribe((resp) => {
      this.sucursales = resp.data;
    });
  }

  listarEmpleados(){
    this.api.consulta('empleados', 'get').subscribe((resp) => {
      this.empleados = resp.data;
    });
  }

  listarArticulos() {
    this.api.consulta('articulos', 'get').subscribe(resp => {
      this.articulos = resp.data;
    });
  }
  listarEstados() {
    this.api.consulta('estados', 'get').subscribe(resp => {
      this.estadosDisponibles = resp.data;
    });
  }
  
  onEstadoSeleccionado(item: any, nuevoEstadoId: number): void {
    const payload = {
      id_estados: nuevoEstadoId
    };
  
    this.api.consulta(`requerimientos/${item.id_requerimiento}`, 'put', payload)
      .subscribe(() => {
        this.modal.success({
          nzTitle: 'Estado actualizado',
          nzContent: `El requerimiento ${item.nro_requerimiento} ha sido actualizado al estado seleccionado.`,
        });
        this.listarRequerimientos();
      }, () => {
        this.modal.error({
          nzTitle: 'Error al actualizar',
          nzContent: `No se pudo actualizar el estado del requerimiento ${item.nro_requerimiento}.`,
        });
      });
  }
  

  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar este requerimiento?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarRequerimiento(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarRequerimiento(id: any) {
    this.api.consulta('requerimientos/'+id, 'delete').subscribe((resp) => {
      this.ngOnInit();
    });
  }

  editarRequerimiento(param: any): void {
    this.router.navigate(['/requerimientos/editar', param]);
  }

  verRequerimiento(param: any): void {
    this.router.navigate(['/requerimientos-recibidos/ver', param]);
  }
  
}
