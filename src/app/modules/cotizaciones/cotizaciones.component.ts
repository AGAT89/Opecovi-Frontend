import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css'],
})
export class CotizacionesComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,     
    private api: ApiService,
) {
    this.uploadForm = this.fb.group({
      requirementNumber: ['', Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
  
      const maxFileSize = 10 * 1024 * 1024; // 10MB en bytes
  
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF.');
        input.value = ''; // Resetea el input file
        return;
      }
  
      if (file.size > maxFileSize) {
        alert('El archivo excede el tamaño máximo de 10MB.');
        input.value = ''; // Resetea el input file
        return;
      }
  
      this.selectedFile = file;
    }
  }
  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      const loggedEmpleadoId = Number(localStorage.getItem('id_empleado')) || 0;
      const formData = new FormData();
  
      formData.append('requirementNumber', this.uploadForm.get('requirementNumber')?.value);
      formData.append('pdfFile', this.selectedFile);
      formData.append('id_empresa', '1'); 
      formData.append('id_sucursal', '1');  
      formData.append('id_solicitud_compra', '1'); 
      formData.append('id_proveedor', '4'); 
      formData.append('id_empleado', loggedEmpleadoId.toString());
  
      const fechaAprobacion = new Date();
      const fechaAprobacionFormateada = fechaAprobacion.toISOString().slice(0, 19).replace('T', ' ');  // Elimina milisegundos y 'T'


      formData.append('fecha_aprobacion', fechaAprobacionFormateada);
      formData.append('imp_neto', '100'); 
      formData.append('imp_base_isc', '10'); 
      formData.append('imp_isc', '5');  
      formData.append('es_eliminado', '0');  
      formData.append('imp_base_igv', '20');  
      formData.append('imp_igv', '18'); 
      formData.append('imp_cobrar', '200');  
  

      this.api.consulta('cotizaciones', 'post', formData).subscribe({
        next: (res) => {
          this.uploadedFiles.push(this.selectedFile!);
          this.uploadForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Error al subir archivo:', err);
        }
      });
    }
  }

  viewFile(file: File): void {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }

  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }
}
