import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || '¿Esta seguro que desea realizar esta operación?');

    return new Observable((observer) => {
      // observable execution
      observer.next(confirmation);
      observer.complete();
  });
  }
}
