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
    contenido_articulo: FormControl<number>;
    tipo_articulo: FormControl<string>;
  }>;

  auxIdArticulo: number = 0;

  constructor(private tableSvc : TableService, private fb: NonNullableFormBuilder, private api: ApiService, private modal: NzModalService) {
    this.displayData = this.productsList;

    this.validateFormArticulo = this.fb.group({
      id_empresa: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cod_articulo: ['', [Validators.required]],
      nomb_articulo: ['', [Validators.required]],
      unidad_medida: ['', [Validators.required]],
      contenido_articulo: [0, [Validators.required]],
      tipo_articulo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listarArticulos();
  }

  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data )
  }

  showModal(tipo: string, articulo?: DataItem): void {
    this.isVisible = true;
  
    if (tipo === 'nuevo') {
      this.auxIdArticulo = 0;
      this.validateFormArticulo.reset();
    } else if (articulo) {
      console.log('Articulo seleccionado para editar:', articulo); // 👈🏻 Aquí
      this.auxIdArticulo = articulo.id_articulo;
  
      this.validateFormArticulo.patchValue({
        id_empresa: '1', // 👈🏻 O el valor real que tenga el artículo
        cod_articulo: articulo.cod_articulo,
        nomb_articulo: articulo.nomb_articulo,
        unidad_medida: articulo.unidad_medida,
        contenido_articulo: Number(articulo.contenido_articulo),
        tipo_articulo: articulo.tipo_articulo
      });
    }
  }
  handleOk(): void {
    if (this.validateFormArticulo.invalid) {
      this.validateFormArticulo.markAllAsTouched();
      return;
    }
  
    this.isOkLoading = true;
  
    const path = this.auxIdArticulo === 0 ? 'articulos' : `articulos/${this.auxIdArticulo}`;
    const method = this.auxIdArticulo === 0 ? 'post' : 'put';
  
    this.api.consulta(path, method, this.validateFormArticulo.value).subscribe(
      () => {
        this.isVisible = false;
        this.isOkLoading = false;
        this.validateFormArticulo.reset();
        this.ngOnInit(); 
      },
      (error) => {
        console.error('Error en la solicitud:', error);
        this.isOkLoading = false;
      }
    );
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
