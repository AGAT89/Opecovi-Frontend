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
  id_empresa?: string;
  id_sucursal?: string;
  id_empleado?: string;
  id_empleado_aprobador?: string;
  requerimientos_detalle?: { id_articulo: string; cant_solicitada: string }[];
}

@Component({
  selector: 'app-requerimientos',
  templateUrl: './requerimientos.component.html',
  styleUrls: ['./requerimientos.component.css']
})
export class RequerimientosComponent implements OnInit {

  // UI state
  isVisible = false;
  isOkLoading = false;

  // Filters and search
  selectedCategory = '';
  selectedStatus = '';
  searchInput = '';

  // Data
  displayData: DataItem[] = [];
  productsList: DataItem[] = [];
  sucursales: any[] = [];
  empleados: any[] = [];
  articulos: any[] = [];
  estadosDisponibles: any[] = [];

  // Modal helper
  auxIdRequerimiento = 0;

  // Table column configuration
  orderColumn = [
    { title: '#', compare: (a: DataItem, b: DataItem) => a.id_requerimiento - b.id_requerimiento },
    { title: 'Nro. requerimiento', compare: (a: DataItem, b: DataItem) => a.nro_requerimiento.localeCompare(b.nro_requerimiento) },
    { title: 'Sucursal', compare: (a: DataItem, b: DataItem) => a.sucursal.localeCompare(b.sucursal) },
    { title: 'Empleado solicitante', compare: (a: DataItem, b: DataItem) => a.empleado.localeCompare(b.empleado) },
    { title: 'Fecha creacion', compare: (a: DataItem, b: DataItem) => a.fecha.localeCompare(b.fecha) },
    { title: 'Estados', compare: (a: DataItem, b: DataItem) => a.codigo_estado.localeCompare(b.codigo_estado) },
    { title: 'Acciones' }
  ];

  // Formulario principal
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

  constructor(
    private tableSvc: TableService,
    private fb: NonNullableFormBuilder,
    private api: ApiService,
    private modal: NzModalService,
    private router: Router
  ) {
    this.validateFormReque = this.fb.group({
      id_requerimiento: ['', Validators.required],
      nro_requerimiento: ['', Validators.required],
      id_empresa: ['', Validators.required],
      id_sucursal: ['', Validators.required],
      id_empleado: ['', Validators.required],
      id_empleado_aprobador: ['', Validators.required],
      id_estados: [0, Validators.required],
      cant_solicitada: ['', Validators.required],
      id_articulo: ['', Validators.required],
      detalle: []
    });
  }

  ngOnInit(): void {
    this.listarRequerimientos();
    this.listarSucursales();
    this.listarEmpleados();
    this.listarArticulos();
    this.listarEstados();
  }

  // ================= UI ACTIONS =================

  search(): void {
    this.displayData = this.tableSvc.search(this.searchInput, this.productsList);
  }

  showModal(tipo: 'nuevo' | 'editar', item?: DataItem): void {
    this.isVisible = true;
    this.auxIdRequerimiento = tipo === 'nuevo' ? 0 : item?.id_requerimiento || 0;

    if (tipo === 'nuevo') {
      this.validateFormReque.reset();
    } else if (item) {
      this.validateFormReque.patchValue({
        nro_requerimiento: item.nro_requerimiento,
        id_empresa: item.id_empresa || '',
        id_sucursal: item.id_sucursal || '',
        id_empleado: item.id_empleado || '',
        id_empleado_aprobador: item.id_empleado_aprobador || ''
      });

      const detalle = item.requerimientos_detalle?.[0];
      if (detalle) {
        this.validateFormReque.patchValue({
          id_articulo: detalle.id_articulo,
          cant_solicitada: detalle.cant_solicitada
        });
      }
    }
  }

  handleOk(): void {
    this.isOkLoading = true;

    const formValue = this.validateFormReque.value;
    const payload = {
      ...formValue,
      id_empresa: '1',
      id_requerimiento: '1',
      id_empleado_aprobador: '1',
      id_estados: 2,
      detalle: [{
        id_articulo: formValue.id_articulo,
        cant_solicitada: formValue.cant_solicitada
      }]
    };

    const request$ = this.auxIdRequerimiento === 0
      ? this.api.consulta('requerimientos', 'post', payload)
      : this.api.consulta(`requerimientos/${this.auxIdRequerimiento}`, 'put', payload);

    request$.subscribe(() => this.finalizarModal());
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  finalizarModal(): void {
    this.isVisible = false;
    this.isOkLoading = false;
    this.ngOnInit();
  }

  // ================ CRUD =================

  listarRequerimientos(): void {
    this.api.consulta('requerimientos', 'get').subscribe(resp => {
      this.displayData = this.productsList = resp.data;
    });
  }

  listarSucursales(): void {
    this.api.consulta('sucursales', 'get').subscribe(resp => {
      this.sucursales = resp.data;
    });
  }

  listarEmpleados(): void {
    this.api.consulta('empleados', 'get').subscribe(resp => {
      this.empleados = resp.data;
    });
  }

  listarArticulos(): void {
    this.api.consulta('articulos', 'get').subscribe(resp => {
      this.articulos = resp.data;
    });
  }

  listarEstados(): void {
    this.api.consulta('estados', 'get').subscribe(resp => {
      this.estadosDisponibles = resp.data;
    });
  }

  onEstadoSeleccionado(item: DataItem, nuevoEstadoId: string): void {
    const parsedEstadoId = parseInt(nuevoEstadoId, 10);

    if (isNaN(parsedEstadoId)) {
      this.modal.error({
        nzTitle: 'Error al actualizar',
        nzContent: 'No se seleccionó un estado válido.',
      });
      return;
    }

    const payload = {
      id_empresa: item.id_empresa,
      id_sucursal: item.id_sucursal,
      id_empleado: item.id_empleado,
      id_empleado_aprobador: item.id_empleado_aprobador,
      nro_requerimiento: item.nro_requerimiento,
      id_estados: parsedEstadoId,
      usuario_modificacion: 'admin'
    };

    this.api.consulta(`requerimientos/${item.id_requerimiento}`, 'put', payload).subscribe({
      next: () => {
        this.modal.success({
          nzTitle: 'Actualizado correctamente',
          nzContent: 'El estado del requerimiento fue actualizado.',
        });
        this.listarRequerimientos();
      },
      error: () => {
        this.modal.error({
          nzTitle: 'Error al actualizar',
          nzContent: 'Ocurrió un error al actualizar el requerimiento.',
        });
      }
    });
  }
  
  getNombreEstado(idEstado: number): string {
    const estado = this.estadosDisponibles.find(e => e.id_estados === idEstado);
    return estado?.nomb_estados?.toLowerCase() || '';
  }

  showDeleteConfirm(id: number): void {
    this.modal.confirm({
      nzTitle: '¿Desea eliminar este requerimiento?',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarRequerimiento(id),
      nzCancelText: 'No'
    });
  }

  eliminarRequerimiento(id: number): void {
    this.api.consulta(`requerimientos/${id}`, 'delete').subscribe(() => {
      this.ngOnInit();
    });
  }

  editarRequerimiento(id: number): void {
    this.router.navigate(['/requerimientos/editar', id]);
  }

  verRequerimiento(id: number): void {
    this.router.navigate(['/requerimientos-recibidos/ver', id]);
  }
}
