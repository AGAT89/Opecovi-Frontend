import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { TableService } from 'src/app/shared/services/table.service';

interface DataItem {
  id: number;
  cod_area: string;
  nomb_area: string;
  centro_costos: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

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
        title: 'Codigo',
        compare: (a: DataItem, b: DataItem) => a.cod_area.localeCompare(b.cod_area)
    },
    {
        title: 'Nombre del articulo',
        compare: (a: DataItem, b: DataItem) => a.nomb_area.localeCompare(b.nomb_area)
    },
    {
        title: 'Cantidad solicitada',
        compare: (a: DataItem, b: DataItem) => a.centro_costos.localeCompare(b.centro_costos)
    },
    {
        title: 'Acciones'
    }
  ]

  productsList = []

  isVisible = false;
  isOkLoading = false;

  validateFormRequerimiento: FormGroup<{
    id_empresa: FormControl<string>;
    id_sucursal: FormControl<string>;
    id_empleado: FormControl<string>;
    id_empleado_aprobador: FormControl<string>;
    nro_requerimiento: FormControl<string>;
    fecha_emision: FormControl<string>;
    fecha_ceracion: FormControl<string>;

  }>;

  validateFormDetalleRequerimiento: FormGroup<{
    id_empresa: FormControl<string>;
    id_requerimiento: FormControl<string>;
    id_articulo: FormControl<string>;
    cant_solicitada: FormControl<string>;
    cant_atendida: FormControl<string>;
  }>;

  auxIdArea : number = 0;

  articulos: any[] = [];

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService, private router: Router) {
    this.displayData = this.productsList;

    this.validateFormRequerimiento = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_sucursal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_empleado: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_empleado_aprobador: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      nro_requerimiento: ['', [Validators.required]],
      fecha_emision: ['', [Validators.required]],
      fecha_ceracion: ['', [Validators.required]],
    });

    this.validateFormDetalleRequerimiento = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_requerimiento: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_articulo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cant_solicitada: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cant_atendida: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnInit(): void {
    this.listarArticulos();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  showModal(tipo: string, area? : any): void {

      this.isVisible = true;
      this.auxIdArea = 0;

  }

  handleOk(): void {

    let articuloSeleccionado = this.articulos.find(articulo => articulo.id_articulo === this.validateFormDetalleRequerimiento.controls.id_articulo.value);

    console.log(articuloSeleccionado);

    this.displayData.push({
      cod_articulo: articuloSeleccionado.cod_articulo,
      id_articulo: articuloSeleccionado.id_articulo,
      nomb_articulo : articuloSeleccionado.nomb_articulo,
      cant_solicitada : this.validateFormDetalleRequerimiento.controls.cant_solicitada.value
    });
    this.productsList =  this.displayData;
        this.isVisible = false;
        this.isOkLoading = false;
        this.validateFormDetalleRequerimiento.reset();
        this.ngOnInit();

        console.log(this.displayData);


  }

  handleCancel(): void {
    this.isVisible = false;
  }



  listarAreas(){
    this.api.consulta('areas', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }



  crearRequerimiento(){
    this.validateFormRequerimiento.controls.id_empresa.setValue('1');
    this.validateFormRequerimiento.controls.id_empleado.setValue('1');
    this.validateFormRequerimiento.controls.id_sucursal.setValue('1');
    this.validateFormRequerimiento.controls.id_empleado_aprobador.setValue('1');
    this.validateFormRequerimiento.controls.fecha_emision.setValue('1');
    this.validateFormRequerimiento.controls.fecha_ceracion.setValue('1');
    let body = {
      id_empresa : 1,
      id_empleado : 1,
      id_sucursal: 1,
      id_empleado_aprobador : 1,
      nro_requerimiento : this.validateFormRequerimiento.controls.nro_requerimiento.value,
      detalle: this.displayData
    };
    this.api.consulta('requerimientos', 'post', body).subscribe((resp) => {
      console.log(resp);
      this.router.navigate(['/requerimientos']);
    });
  }

  listarArticulos(){
    this.api.consulta('articulos', 'get').subscribe((resp) => {

      this.articulos = resp.data;
    });
  }

  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar ah este articulo?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarArea(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarArea(id: any) {
    this.displayData = this.displayData.filter(articulo => articulo.id_articulo !== id);
    // this.api.consulta('areas/'+id, 'delete').subscribe((resp) => {

    //   this.ngOnInit();
    // });
  }

}
