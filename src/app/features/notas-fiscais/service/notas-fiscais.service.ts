import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Suplier } from '../../supliers/service/supliers.service';
import { ItemNfiscal } from './item-nfiscal.service';
import { environment } from '../../../../environments/environment';

export interface NotaFiscal {
    id?: number;
    numberNota?: string;
    emissionDate?: Date | string;
    suplier?: Suplier;
    address?: string;
    totalValue?: number;
    createdAt?: Date;
    updatedAt?: Date;
    items?: ItemNfiscal[];
}

@Injectable({
    providedIn: 'root'
})
export class NotasFiscaisService {
    private apiUrl = `${environment.apiUrl}/notas-fiscais`;
    private notasFiscaisSubject = new BehaviorSubject<NotaFiscal[]>([]);
    notasFiscais$ = this.notasFiscaisSubject.asObservable();

    constructor(private http: HttpClient) { }

    getNotasFiscais(): Observable<NotaFiscal[]> {
        return this.http.get<NotaFiscal[]>(this.apiUrl).pipe(
            tap(notasFiscais => {
                notasFiscais.forEach(notaFiscal => {
                  if (notaFiscal.emissionDate) {
                      notaFiscal.emissionDate = new Date(notaFiscal.emissionDate);
                  }
                });
                this.notasFiscaisSubject.next(notasFiscais);
            }),
            catchError(this.handleError)
        );
    }

    getNotaFiscalById(id: number): Observable<NotaFiscal> {
        return this.http.get<NotaFiscal>(`${this.apiUrl}/${id}`).pipe(
            tap(notaFiscal => {
              if (notaFiscal.emissionDate) {
                  notaFiscal.emissionDate = new Date(notaFiscal.emissionDate);
              }
            }),
            catchError(this.handleError)
        );
    }

    createNotaFiscal(notaFiscal: NotaFiscal): Observable<NotaFiscal> {
        return this.http.post<NotaFiscal>(this.apiUrl, notaFiscal).pipe(
            tap(() => this.getNotasFiscais().subscribe()),
            catchError(this.handleError)
        );
    }

    updateNotaFiscal(id: number, notaFiscal: NotaFiscal): Observable<NotaFiscal> {
        return this.http.put<NotaFiscal>(`${this.apiUrl}/${id}`, notaFiscal).pipe(
            tap(() => this.getNotasFiscais().subscribe()),
            catchError(this.handleError)
        );
    }

    deleteNotaFiscal(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.getNotasFiscais().subscribe()),
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