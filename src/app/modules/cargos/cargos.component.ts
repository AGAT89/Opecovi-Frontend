import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { TableService } from 'src/app/shared/services/table.service';

interface DataItem {
  id: number;
  area: string;
  cod_cargo: string;
  nomb_cargo: string;
}

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {

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
        title: 'Area',
        compare: (a: DataItem, b: DataItem) => a.area.localeCompare(b.area)
    },
    {
        title: 'Codigo del cargo',
        compare: (a: DataItem, b: DataItem) => a.cod_cargo.localeCompare(b.cod_cargo)
    },
    {
        title: 'Cargo',
        compare: (a: DataItem, b: DataItem) => a.nomb_cargo.localeCompare(b.nomb_cargo)
    },
    {
        title: 'Acciones'
    }
  ]

  productsList = []

  isVisible = false;
  isOkLoading = false;

  validateFormCargo: FormGroup<{
    id_empresa: FormControl<string>;
    id_area: FormControl<string>;
    cod_cargo: FormControl<string>;
    nomb_cargo: FormControl<string>;
  }>;

  auxIdCargo : number = 0;

  areas: any[] = [];

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;

    this.validateFormCargo = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      id_area: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cod_cargo: ['', [Validators.required]],
      nomb_cargo: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.listarCargos();
    this.listarAreas();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  showModal(tipo: string, cargo? : any): void {
    console.log(cargo);
    if (tipo == 'nuevo') {
      this.isVisible = true;
      this.auxIdCargo = 0;
    } else {
      console.log(cargo);
      this.auxIdCargo = cargo.id_cargo;
      this.validateFormCargo.controls.id_empresa.setValue(cargo.id_empresa);
      this.validateFormCargo.controls.id_area.setValue(cargo.id_area);
      this.validateFormCargo.controls.cod_cargo.setValue(cargo.cod_cargo);
      this.validateFormCargo.controls.nomb_cargo.setValue(cargo.nomb_cargo);
      console.log(this.validateFormCargo.value);
      this.isVisible = true;
    }
  }

  handleOk(): void {

    if (this.auxIdCargo == 0) {
      this.isOkLoading = true;
      this.validateFormCargo.controls.id_empresa.setValue('1');

      this.api.consulta('cargos', 'post', this.validateFormCargo.value).subscribe((resp) => {


        this.isVisible = false;
        this.isOkLoading = false;

        this.ngOnInit();

      });
    } else {
      this.isOkLoading = true;

      this.api.consulta('cargos/'+this.auxIdCargo, 'put', this.validateFormCargo.value).subscribe((resp) => {

         this.isVisible = false;
          this.isOkLoading = false;

          this.ngOnInit();


      });
    }


  }

  handleCancel(): void {
    this.isVisible = false;
  }



  listarCargos(){
    this.api.consulta('cargos', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }

  listarAreas(){
    this.api.consulta('areas', 'get').subscribe((resp) => {

      this.areas = resp.data;
    });
  }

  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar ah este cargo?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarCargo(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarCargo(id: any) {
    this.api.consulta('cargos/'+id, 'delete').subscribe((resp) => {

      this.ngOnInit();
    });
  }

}
