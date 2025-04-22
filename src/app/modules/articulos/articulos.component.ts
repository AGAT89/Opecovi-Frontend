import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
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
  styleUrls: ['./articulos.component.css'],
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
      compare: (a: DataItem, b: DataItem) =>
        a.cod_articulo.localeCompare(b.cod_articulo),
    },
    {
      title: 'Nombre articulo',
      compare: (a: DataItem, b: DataItem) =>
        a.nomb_articulo.localeCompare(b.nomb_articulo),
    },
    {
      title: 'Unidad medida',
      compare: (a: DataItem, b: DataItem) =>
        a.unidad_medida.localeCompare(b.unidad_medida),
    },
    {
      title: 'Stock',
      compare: (a: DataItem, b: DataItem) => a.stock - b.stock,
    },
    {
      title: 'Contenido articulo',
      compare: (a: DataItem, b: DataItem) =>
        a.contenido_articulo.localeCompare(b.contenido_articulo),
    },
    {
      title: 'Tipo articulo',
      compare: (a: DataItem, b: DataItem) =>
        a.tipo_articulo.localeCompare(b.tipo_articulo),
    },
    {
      title: 'Acciones',
    },
  ];
  productsList = [];
  isVisible = false;
  isOkLoading = false;

  // Lista de formularios para múltiples artículos
  articulosForms: FormGroup[] = [];

  constructor(
    private tableSvc: TableService,
    private fb: NonNullableFormBuilder,
    private api: ApiService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.listarArticulos();
  }

  search(): void {
    const data = this.productsList;
    this.displayData = this.tableSvc.search(this.searchInput, data);
  }

  showModal(): void {
    this.articulosForms = [this.createArticuloForm()]; // Inicializa con un formulario vacío
    this.isVisible = true;
  }

  // Crea un nuevo formulario de artículo
  createArticuloForm(): FormGroup {
    return this.fb.group({
      id_empresa: ['1', [Validators.required, Validators.pattern('^[0-9]+$')]],
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

  // Agrega un nuevo formulario a la lista
  addArticuloForm(): void {
    this.articulosForms.push(this.createArticuloForm());
  }

  // Elimina un formulario de la lista
  removeArticuloForm(index: number): void {
    this.articulosForms.splice(index, 1);
  }

  handleOk(): void {
    this.isOkLoading = true;

    // Envía todos los formularios al backend
    const requests = this.articulosForms.map((form) => {
      const formData = form.value;
      return this.api.consulta('articulos', 'post', formData).toPromise();
    });

    // Espera a que todas las solicitudes se completen
    Promise.all(requests)
      .then(() => {
        this.resetFormAndCloseModal();
      })
      .catch((err) => {
        console.error('Error al guardar artículos:', err);
        this.isOkLoading = false;
      });
  }

  private resetFormAndCloseModal(): void {
    this.isVisible = false;
    this.isOkLoading = false;
    this.articulosForms = [];
    this.ngOnInit(); // Refresca datos
  }

  handleCancel(): void {
    this.isVisible = false;
    this.articulosForms = [];
  }

  listarArticulos() {
    this.api.consulta('articulos', 'get').subscribe((resp) => {
      this.displayData = resp.data;
      this.productsList = resp.data;
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
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  eliminarArticulo(id: any) {
    this.api.consulta(`articulos/${id}`, 'delete').subscribe(() => {
      this.listarArticulos();
    });
  }
}
