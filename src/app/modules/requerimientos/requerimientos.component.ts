import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { TableService } from 'src/app/shared/services/table.service';

interface DataItem {
  id: number;
  nro_requerimiento: string;
  sucursal: string;
  fecha: string;
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

  orderColumn = [
    {
        title: '#',
        compare: (a: DataItem, b: DataItem) => a.id - b.id,
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
        title: 'Fecha creacion',
        compare: (a: DataItem, b: DataItem) => a.fecha.localeCompare(b.fecha)
    },
    {
        title: 'Empleado solicitante',
        compare: (a: DataItem, b: DataItem) => a.empleado.localeCompare(b.empleado)
    },
    {
        title: 'Acciones'
    }
  ]

  productsList = []

  isVisible = false;
  isOkLoading = false;

  validateFormArea: FormGroup<{
    id_empresa: FormControl<string>;
    cod_area: FormControl<string>;
    nomb_area: FormControl<string>;
    centro_costos: FormControl<string>;
  }>;

  auxIdArea : number = 0;

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService, private router: Router) {
    this.displayData = this.productsList;

    this.validateFormArea = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cod_area: ['', [Validators.required]],
      nomb_area: ['', [Validators.required]],
      centro_costos: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listarRequerimientos();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  showModal(tipo: string, area? : any): void {
    if (tipo == 'nuevo') {
      this.isVisible = true;
      this.auxIdArea = 0;
    } else {
      console.log(area);
      this.auxIdArea = area.id_area;
      this.validateFormArea.controls.id_empresa.setValue(area.id_empresa);
      this.validateFormArea.controls.cod_area.setValue(area.cod_area);
      this.validateFormArea.controls.nomb_area.setValue(area.nomb_area);
      this.validateFormArea.controls.centro_costos.setValue(area.centro_costos);

      this.isVisible = true;
    }
  }

  handleOk(): void {

    if (this.auxIdArea == 0) {
      this.isOkLoading = true;
      this.validateFormArea.controls.id_empresa.setValue('1');

      this.api.consulta('areas', 'post', this.validateFormArea.value).subscribe((resp) => {


        this.isVisible = false;
        this.isOkLoading = false;

        this.ngOnInit();

      });
    } else {
      this.isOkLoading = true;

      this.api.consulta('areas/'+this.auxIdArea, 'put', this.validateFormArea.value).subscribe((resp) => {

         this.isVisible = false;
          this.isOkLoading = false;

          this.ngOnInit();


      });
    }


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



  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar ah este requerimiento?',
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
      console.log(resp);
      this.ngOnInit();
    });
  }

  editarRequerimiento(param: any): void {
    this.router.navigate(['/requerimientos/editar', param]);
  }


}
