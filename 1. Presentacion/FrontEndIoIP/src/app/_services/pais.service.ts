import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { PaisDto } from 'src/app/_model/PaisDto.model';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  baseUrl = environment.apiUrl + 'Pais/';

constructor(private http: HttpClient, private router: Router) { }

listar(): Observable<PaisDto[]> {
  return this.http.get<PaisDto[]>(this.baseUrl + 'ListarTodo');
}

obtenerPorId(id: string): Observable<PaisDto> {
  return this.http.get<PaisDto>(this.baseUrl + 'ObtenerPorId/' + id, httpOptions);
}

navegarCrear() {
  this.router.navigate(['/CrearPais']);
}

navegarAyuda() {
  this.router.navigate(['/AyudaPais']);
}

navegarModificar(idIn: string) {
  this.router.navigate(['/ModificarPais'], { queryParams: { id: idIn } });
}

ver(idIn: string) {
  this.router.navigate(['/VerPais'], { queryParams: { id: idIn } });
}

navegarLista() {
  this.router.navigate(['/ConfigPaiss']);
}


crear(rango: PaisDto): Observable<PaisDto> {
  return this.http.post<PaisDto>(this.baseUrl + 'Registrar', rango, httpOptions);
}

eliminar(idRango: string) {
  return this.http.delete(this.baseUrl + idRango, httpOptions);
}

actualizar(rango: PaisDto): Observable<PaisDto> {
  return this.http.put<PaisDto>(this.baseUrl + 'Actualizar', rango, httpOptions);
}

listarTodo(): Observable<PaisDto[]> {
  return this.http.get<PaisDto[]>(this.baseUrl + 'ListarTodo', httpOptions);
}
}
