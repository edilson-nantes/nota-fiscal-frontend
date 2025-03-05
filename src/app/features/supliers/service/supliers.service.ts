import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Suplier {
    id?: number;
    code?: string;
    legalName?: string;
    email?: string;
    phone?: string;
    cnpj?: string;
    situation?: string;
    dataBaixa?: Date;
    hasMovement?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SupliersService {
  private apiUrl = `${environment.apiUrl}/supliers`;
  private supliersSubject = new BehaviorSubject<Suplier[]>([]);
  supliers$ = this.supliersSubject.asObservable();

  constructor(private http: HttpClient) { }

  getSupliers(): Observable<Suplier[]> {
      return this.http.get<Suplier[]>(this.apiUrl).pipe(
        tap(supliers => {
          supliers.forEach(suplier => {
              if (suplier.dataBaixa) {
                  suplier.dataBaixa = new Date(suplier.dataBaixa);
              }
          });
          this.supliersSubject.next(supliers);
        }),
        catchError(this.handleError)
      );
  }

  getSuplierById(id: number): Observable<Suplier> {
    return this.http.get<Suplier>(`${this.apiUrl}/${id}`).pipe(
      tap(suplier => {
          if (suplier.dataBaixa) {
              suplier.dataBaixa = new Date(suplier.dataBaixa);
          }
      }),
      catchError(this.handleError)
    );
  }

  createSuplier(suplier: Suplier): Observable<Suplier> {
    return this.http.post<Suplier>(this.apiUrl, suplier).pipe(
      tap(() => this.getSupliers().subscribe()),
      catchError(this.handleError)
    );
  }

  updateSuplier(id: number, suplier: Suplier): Observable<Suplier> {
      return this.http.put<Suplier>(`${this.apiUrl}/${id}`, suplier).pipe(
          tap(() => this.getSupliers().subscribe()),
          catchError(this.handleError)
      );
  }

  deleteSuplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getSupliers().subscribe()),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
        
        errorMessage = `Error: ${error.error.message}`;
    } else {
        
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
}
}