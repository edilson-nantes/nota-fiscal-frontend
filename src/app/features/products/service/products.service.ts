import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Product {
    id?: number;
    code?: string;
    description?: string;
    situation?: string;
    hasMovement?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.apiUrl).pipe(
          tap(products => this.productsSubject.next(products)),
          catchError(this.handleError)
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
  );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(() => this.getProducts().subscribe()),
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
      return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
          tap(() => this.getProducts().subscribe()),
          catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getProducts().subscribe()),
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
    return throwError(errorMessage);
}
}