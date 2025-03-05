import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotaFiscal, NotasFiscaisService } from './service/notas-fiscais.service';
import { ItemNfiscal, ItemNfiscalService } from './service/item-nfiscal.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Suplier, SupliersService } from '../supliers/service/supliers.service';
import { DatePickerModule } from 'primeng/datepicker';
import { format } from 'date-fns';
import { Product, ProductsService } from '../products/service/products.service';

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
    selector: 'app-notas-fiscais',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        DatePickerModule,
    ],
    templateUrl: './notas-fiscais.component.html',
    providers: [MessageService, NotasFiscaisService, SupliersService, ConfirmationService]
})
export class NotasFiscaisComponent implements OnInit {
    notaFiscalDialog: boolean = false;

    notasFiscais = signal<NotaFiscal[]>([]);

    notaFiscal!: NotaFiscal;

    supliers = signal<Suplier[]>([]);

    suplier!: Suplier;

    selectedNotasFiscais!: NotaFiscal[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    itemDialog: boolean = false;

    items = signal<ItemNfiscal[]>([]);

    item!: ItemNfiscal;

    products = signal<Product[]>([]);

    product!: Product;

    constructor(
        private notasFiscaisService: NotasFiscaisService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private supliersService: SupliersService,
        private productsService: ProductsService,
        private itemsService: ItemNfiscalService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.notasFiscaisService.notasFiscais$.subscribe((data) => {
            this.notasFiscais.set(data);
        });
        this.notasFiscaisService.getNotasFiscais().subscribe();

        this.supliersService.supliers$.subscribe((data) => {
            data.map((suplier) => {
                if (!suplier.hasMovement){
                    this.supliers.update(supliers => [...supliers, suplier]);
                };
            })
        });
        this.supliersService.getSupliers().subscribe();

        this.productsService.products$.subscribe((data) => {
            data.map((product) => {
                if (!product.hasMovement){
                    this.products.update(products => [...products, product]);
                }
            })
        });
        this.productsService.getProducts().subscribe();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.notaFiscal = { items: [] };
        this.submitted = false;
        this.notaFiscalDialog = true;
    }

    editNotaFiscal(notaFiscal: NotaFiscal) {
        this.notaFiscal = { ...notaFiscal };
        this.notaFiscalDialog = true;
    }

    deleteSelectedNotasFiscais() {
        this.confirmationService.confirm({
            message: 'Você tem certeza que quer deletar as notas fiscais selecionadas?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedNotasFiscais?.forEach(notaFiscal => {
                    this.notasFiscaisService.deleteNotaFiscal(notaFiscal.id!).subscribe(() => {
                        this.loadData();
                    });
                });
                this.selectedNotasFiscais = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Notas Fiscais Deletadas',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.notaFiscalDialog = false;
        this.submitted = false;
    }

    deleteNotaFiscal(notaFiscal: NotaFiscal) {
        console.log(notaFiscal);
        this.confirmationService.confirm({
            message: 'Você tem certeza que quer deletar a nota fiscal:  ' + notaFiscal.numberNota + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.notasFiscaisService.deleteNotaFiscal(notaFiscal.id!).subscribe(() => {
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Nota Fiscal Deletada',
                        life: 3000
                    });
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.notasFiscais().length; i++) {
            if (this.notasFiscais()[i].id === Number(id)) {
                index = i;
                break;
            }
        }

        return index;
    }

    saveNotaFiscal() {
        this.submitted = true;
        if (this.notaFiscal.numberNota?.trim()) {
            if (this.notaFiscal.emissionDate) {
                this.notaFiscal.emissionDate = format(this.notaFiscal.emissionDate, "yyyy-MM-dd'T'HH:mm:ss");
            }
            if(this.notaFiscal.suplier) {
                this.notaFiscal.suplier = {
                    id: this.notaFiscal.suplier,
                } as Suplier
            }
            
            if (this.notaFiscal.id) {
                this.notasFiscaisService.updateNotaFiscal(this.notaFiscal.id, this.notaFiscal).pipe(
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
                        detail: 'Nota Fiscal Atualizada',
                        life: 3000
                    });
                });
            } else {
                this.notasFiscaisService.createNotaFiscal(this.notaFiscal).pipe(
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
                        detail: 'Nota Fiscal Criada',
                        life: 3000
                    });
                });
            }

            this.notaFiscalDialog = false;
            this.notaFiscal = {};
        }
    }

    openNewItem() {
        this.item = {};
        this.itemDialog = true;
    }

    editItem(item: ItemNfiscal) {
        this.item = { ...item, };

        console.log(this.item);

        this.itemDialog = true;
    }

    deleteItem(item: ItemNfiscal) {
        this.confirmationService.confirm({
            message: ' Vocé tem certeza que quer deletar o item:  ' + item + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.itemsService.deleteItem(item.id!).subscribe(() => {
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Item Deletado',
                        life: 3000
                    });
                });
            }
        })
    }

    saveItem() {
        this.submitted = true;
        if (this.item.product && this.item.quantity && this.item.unitValue) {
            
            
            this.item.product = {
                id: this.item.product
            } as Product

            this.item.notaFiscal = {
                id: this.notaFiscal.id,
            }

            if (this.item.id) {
                this.itemsService.updateItem(this.item.id, this.item).pipe(
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
                        detail: 'Item Atualizado',
                        life: 3000
                    });
                });
            } else {
                this.itemsService.createItem(this.item).pipe(
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
                        detail: 'Item Criado',
                        life: 3000
                    });    
                });
            }

            this.itemDialog = false;
            this.item = {};
        }
    }
}