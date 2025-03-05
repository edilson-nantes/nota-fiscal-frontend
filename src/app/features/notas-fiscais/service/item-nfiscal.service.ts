import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Product } from '../../products/service/products.service';
import { NotaFiscal } from './notas-fiscais.service';
import { environment } from '../../../../environments/environment';


export interface ItemNfiscal {
    id?: number;
    notaFiscal?: NotaFiscal;
    product?: Product;
    quantity?: number;
    unitValue?: number;
    totalItemValue?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ItemNfiscalService {
    private apiUrl = `${environment.apiUrl}/items-nfiscal`;
    private itemsSubject = new BehaviorSubject<ItemNfiscal[]>([]);
    items$ = this.itemsSubject.asObservable();

    constructor(private http: HttpClient) { }

    getItems(): Observable<ItemNfiscal[]> {
        return this.http.get<ItemNfiscal[]>(`${this.apiUrl}`)
            .pipe(
                tap(data => this.itemsSubject.next(data)),
                catchError(this.handleError)
            );
    }

    createItem(item: ItemNfiscal): Observable<ItemNfiscal> {
        return this.http.post<ItemNfiscal>(`${this.apiUrl}`, item)
            .pipe(
                tap(data => this.itemsSubject.next([...this.itemsSubject.getValue(), data])),
                catchError(this.handleError)
            );
    }

    updateItem(id: number, item: ItemNfiscal): Observable<ItemNfiscal> {
        return this.http.put<ItemNfiscal>(`${this.apiUrl}/${id}`, item)
            .pipe(
                tap(data => this.itemsSubject.next([...this.itemsSubject.getValue(), data])),
                catchError(this.handleError)
            );
    }

    deleteItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                tap(() => this.getItems().subscribe()),
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