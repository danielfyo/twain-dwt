import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CiudadDto } from 'src/app/_model/CiudadDto.model';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  baseUrl = environment.apiUrl + "Ciudad/";

constructor(private http: HttpClient, private router: Router) { }

listar(): Observable<CiudadDto[]> {
  return this.http.get<CiudadDto[]>(this.baseUrl + 'ListarTodo', httpOptions);
}

obtenerPorId(id: string): Observable<CiudadDto> {
  return this.http.get<CiudadDto>(this.baseUrl + 'ObtenerPorId/' + id, httpOptions);
}

navegarCrear() {
  this.router.navigate(['/CrearCiudad']);
}

navegarAyuda() {
  this.router.navigate(['/AyudaCiudad']);
}

navegarModificar(idIn: string) {
  this.router.navigate(['/ModificarCiudad'], { queryParams: { id: idIn } });
}

ver(idIn: string) {
  this.router.navigate(['/VerCiudad'], { queryParams: { id: idIn } });
}

navegarLista() {
  this.router.navigate(['/ConfigCiudads']);
}


crear(rango: CiudadDto): Observable<CiudadDto> {
  return this.http.post<CiudadDto>(this.baseUrl + 'Registrar', rango, httpOptions);
}

eliminar(idRango: string) {
  return this.http.delete(this.baseUrl + idRango, httpOptions);
}

actualizar(rango: CiudadDto): Observable<CiudadDto> {
  return this.http.put<CiudadDto>(this.baseUrl + 'Actualizar', rango, httpOptions);
}

listarTodo(): Observable<CiudadDto[]> {
  return this.http.get<CiudadDto[]>(this.baseUrl + 'ListarTodo', httpOptions);
}
}
