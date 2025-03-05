import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductsService } from './service/products.service';
import { catchError, throwError } from 'rxjs';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        ToolbarModule,
        InputTextModule,
        TextareaModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
    ],
    templateUrl: './products.component.html',
    providers: [MessageService, ProductsService, ConfirmationService]
})
export class ProductsComponent implements OnInit {
    productDialog: boolean = false;

    products = signal<Product[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productsService: ProductsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
      this.productsService.products$.subscribe((data) => {
        this.products.set(data);
      });
      this.productsService.getProducts().subscribe();
        
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Você tem certeza que quer deletar os produtos selecionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.selectedProducts?.forEach(product => {
                this.productsService.deleteProduct(product.id!).subscribe(() => {
                    this.loadData();
                });
              });
              this.selectedProducts = null;
              this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Products Deleted',
                  life: 3000
              });
            }
        });
    }


    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que quer deletar o produto:  ' + product.code + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.productsService.deleteProduct(product.id!).subscribe(() => {
                this.loadData();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
              });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === Number(id)) {
                index = i;
                break;
            }
        }

        return index;
    }

    saveProduct() {
      this.submitted = true;
      if (this.product.code?.trim()) {
          if (this.product.id) {
            this.productsService.updateProduct(this.product.id, this.product).pipe(
              catchError((error) => {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: error,
                      life: 3000
                  });
                  return throwError(() => error);
              })
              ).subscribe(() => {
                  this.loadData();
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'Product Updated',
                      life: 3000
                  });
              });
          } else {
              this.productsService.createProduct(this.product).subscribe(() => {
                  this.loadData();
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'Product Created',
                      life: 3000
                  });
              });
          }

          this.productDialog = false;
          this.product = {};
      }
    }
}