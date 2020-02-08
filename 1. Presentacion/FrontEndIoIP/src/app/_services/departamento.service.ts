import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DepartamentoDto } from 'src/app/_model/DepartamentoDto.model';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  baseUrl = environment.apiUrl + 'Departamento/';

constructor(private http: HttpClient, private router: Router) { }

listar(): Observable<DepartamentoDto[]> {
  return this.http.get<DepartamentoDto[]>(this.baseUrl + 'ListarTodo', httpOptions);
}

obtenerPorId(id: string): Observable<DepartamentoDto> {
  return this.http.get<DepartamentoDto>(this.baseUrl + 'ObtenerPorId/' + id, httpOptions);
}

navegarCrear() {
  this.router.navigate(['/CrearDepartamento']);
}

navegarAyuda() {
  this.router.navigate(['/AyudaDepartamento']);
}

navegarModificar(idIn: string) {
  this.router.navigate(['/ModificarDepartamento'], { queryParams: { id: idIn } });
}

ver(idIn: string) {
  this.router.navigate(['/VerDepartamento'], { queryParams: { id: idIn } });
}

navegarLista() {
  this.router.navigate(['/ConfigDepartamentos']);
}


crear(rango: DepartamentoDto): Observable<DepartamentoDto> {
  return this.http.post<DepartamentoDto>(this.baseUrl + 'Registrar', rango, httpOptions);
}

eliminar(idRango: string) {
  return this.http.delete(this.baseUrl + idRango, httpOptions);
}

actualizar(rango: DepartamentoDto): Observable<DepartamentoDto> {
  return this.http.put<DepartamentoDto>(this.baseUrl + 'Actualizar', rango, httpOptions);
}

listarTodo(): Observable<DepartamentoDto[]> {
  return this.http.get<DepartamentoDto[]>(this.baseUrl + 'ListarTodo', httpOptions);
}
}
