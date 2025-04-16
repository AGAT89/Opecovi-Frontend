import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { TableService } from 'src/app/shared/services/table.service';

interface DataItem {
  id_articulo: number;
  cod_articulo: string;
  nomb_articulo: string;
  unidad_medida: string;
  stock: number;
  stock_minimo: number;
  stock_maximo: number;
  contenido_articulo: string;
  tipo_articulo: string;
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
        compare: (a: DataItem, b: DataItem) => a.id_articulo - b.id_articulo,
    },
    {
        title: 'Codigo',
        compare: (a: DataItem, b: DataItem) => a.cod_articulo.localeCompare(b.cod_articulo)
    },
    {
        title: 'Nombre articulo',
        compare: (a: DataItem, b: DataItem) => a.nomb_articulo.localeCompare(b.nomb_articulo)
    },
    {
        title: 'Unidad medida',
        compare: (a: DataItem, b: DataItem) => a.unidad_medida.localeCompare(b.unidad_medida)
    },
    {
      title: 'Stock',
      compare: (a: DataItem, b: DataItem) =>  a.stock - b.stock,
    },
    {
      title: 'Contenido articulo',
      compare: (a: DataItem, b: DataItem) => a.unidad_medida.localeCompare(b.unidad_medida)
  },
    {
      title: 'Tipo articulo',
      compare: (a: DataItem, b: DataItem) => a.tipo_articulo.localeCompare(b.tipo_articulo)
    },
   
   
    {
        title: 'Acciones'
    }
  ]

  productsList = []

  isVisible = false;
  isOkLoading = false;

  validateFormArticulo: FormGroup<{
    id_empresa: FormControl<string>;
    cod_articulo: FormControl<string>;
    nomb_articulo: FormControl<string>;
    unidad_medida: FormControl<string>;
    stock: FormControl<number>;
    stock_minimo: FormControl<number>;
    stock_maximo: FormControl<number>;
    contenido_articulo: FormControl<number>;
    tipo_articulo: FormControl<string>;
    peso_articulo: FormControl<number>;
    volumen_articulo: FormControl<number>;
    cod_barra_articulo: FormControl<string>;
  }>;

  auxIdArticulo: number = 0;

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;

    this.validateFormArticulo = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cod_articulo: ['', [Validators.required]],
      nomb_articulo: ['', [Validators.required]],
      unidad_medida: ['', [Validators.required]],
      stock: [0, [Validators.required]],
      stock_minimo: [0, [Validators.required]],
      stock_maximo: [0, [Validators.required]],
      contenido_articulo: [0, [Validators.required]],
      tipo_articulo: ['', [Validators.required]],
      peso_articulo: [0],
      volumen_articulo: [0],
      cod_barra_articulo: [''],
    });
  }

  ngOnInit(): void {
    this.listarArticulos();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }



  showModal(tipo: string, articulo?: any): void {
    if (tipo === 'nuevo') {
      this.validateFormArticulo.reset();
      this.isVisible = true;
      this.auxIdArticulo = 0;
    } else {
      this.auxIdArticulo = articulo.id_articulo;
      this.validateFormArticulo.controls.id_empresa.setValue(articulo.id_empresa);
      this.validateFormArticulo.controls.cod_articulo.setValue(articulo.cod_articulo);
      this.validateFormArticulo.controls.nomb_articulo.setValue(articulo.nomb_articulo);
      this.validateFormArticulo.controls.unidad_medida.setValue(articulo.unidad_medida);
      this.validateFormArticulo.controls.stock.setValue(articulo.stock);
      this.validateFormArticulo.controls.stock_minimo.setValue(articulo.stock_minimo);
      this.validateFormArticulo.controls.stock_maximo.setValue(articulo.stock_maximo);
      this.validateFormArticulo.controls.contenido_articulo.setValue(articulo.contenido_articulo);
      this.validateFormArticulo.controls.tipo_articulo.setValue(articulo.tipo_articulo);
      this.validateFormArticulo.controls.peso_articulo.setValue(articulo.peso_articulo);
      this.validateFormArticulo.controls.volumen_articulo.setValue(articulo.volumen_articulo);
      this.validateFormArticulo.controls.cod_barra_articulo.setValue(articulo.cod_barra_articulo);
      console.log(this.validateFormArticulo.value);
      this.isVisible = true;
    }
  }

  handleOk(): void {
    const isNew = this.auxIdArticulo === 0;
    this.isOkLoading = true;
  
    if (isNew) {
      this.validateFormArticulo.controls.id_empresa.setValue('1');
    }
  
    const method = isNew ? 'post' : 'put';
    const endpoint = isNew
      ? 'articulos'
      : `articulos/${this.auxIdArticulo}`;  
  
    const formData = this.validateFormArticulo.value;
  
    this.api.consulta(endpoint, method, formData).subscribe({
      next: (resp) => {
        this.resetFormAndCloseModal();
      },
      error: (err) => {
        console.error('Error al guardar artículo:', err);
        this.isOkLoading = false;
      },
    });
  }
    
  private resetFormAndCloseModal(): void {
    this.isVisible = false;
    this.isOkLoading = false;
    this.validateFormArticulo.reset();
    this.ngOnInit(); // Refresca datos
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  listarArticulos(){
    this.api.consulta('articulos', 'get').subscribe((resp) => {

      this.displayData = resp.data;
      this.productsList =  resp.data;
    });
  }



  showDeleteConfirm(id: any): void {
    this.modal.confirm({
      nzTitle: 'Desea eliminar este articulo?',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarArticulo(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  eliminarArticulo(id: any) {
   this.api.consulta(`articulos/${id}`, 'delete').subscribe(() => {
    this.listarArticulos();
  });
  }

}
