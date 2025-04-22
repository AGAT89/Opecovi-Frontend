import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'http://127.0.0.1:8000/api/';

  apiPeruRUC = 'https://apiperu.dev/api/ruc';
  apiPeruDNI = 'https://apiperu.dev/api/dni';

  private headers = new HttpHeaders({
    'Accept' : 'application/json',
    'Content-Type' : 'application/json',
    'Authorization' : 'Bearer cc35774c0f2ac7dc26348889039ebdf296a893a4097c6bfbb767aaac8f6cd33c'
  });

  constructor(private http: HttpClient) { }

  consulta(url: string, metodo: string, body?: any): Observable<any> {
    switch (metodo) {
      case 'get':
        return this.http.get(`${this.apiUrl}${url}`);
        break;

      case 'post':
        return this.http.post(`${this.apiUrl}${url}`, body);
        break;

      case 'put':
        return this.http.put(`${this.apiUrl}${url}`, body);
        break;

      case 'delete':
        return this.http.delete(`${this.apiUrl}${url}`);
        break;

      default:
        return this.http.get(`${this.apiUrl}${url}`);
        break;
    }
  }

  consultaApiPeru(type: String, body?: any): Observable<any> {
    if (type == 'NATURAL') {
      return this.http.post(`${this.apiPeruDNI}`, body,{headers: this.headers});
    } else {
      return this.http.post(`${this.apiPeruRUC}`, body,{headers: this.headers});
    }
  }

}
