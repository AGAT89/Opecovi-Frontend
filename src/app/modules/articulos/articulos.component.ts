import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {

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
        title: 'Nombre articulo',
        compare: (a: DataItem, b: DataItem) => a.nomb_area.localeCompare(b.nomb_area)
    },
    {
        title: 'Unidad medida',
        compare: (a: DataItem, b: DataItem) => a.centro_costos.localeCompare(b.centro_costos)
    },
    {
      title: 'Tipo articulo',
      compare: (a: DataItem, b: DataItem) => a.centro_costos.localeCompare(b.centro_costos)
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

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;

    this.validateFormArea = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cod_area: ['', [Validators.required]],
      nomb_area: ['', [Validators.required]],
      centro_costos: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listarAreas();
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
        this.validateFormArea.reset();
        this.ngOnInit();

      });
    } else {
      this.isOkLoading = true;

      this.api.consulta('areas/'+this.auxIdArea, 'put', this.validateFormArea.value).subscribe((resp) => {

         this.isVisible = false;
          this.isOkLoading = false;
          this.validateFormArea.reset();
          this.ngOnInit();


      });
    }


  }

  handleCancel(): void {
    this.isVisible = false;
  }

  listarAreas(){
    this.api.consulta('articulos', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }



  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar ah esta area?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarArea(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarArea(id: any) {
    this.api.consulta('areas/'+id, 'delete').subscribe((resp) => {

      this.ngOnInit();
    });
  }

}
