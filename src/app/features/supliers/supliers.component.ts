import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Suplier, SupliersService } from './service/supliers.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';

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
    selector: 'app-supliers',
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        TableModule,
        FormsModule,
        ButtonModule,
        DatePickerModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    templateUrl: './supliers.component.html',
    styleUrls: ['./supliers.component.css'],
    providers: [MessageService, SupliersService, ConfirmationService]
})
export class SupliersComponent implements OnInit {
    suplierDialog: boolean = false;

    supliers: Suplier[] = [];

    suplier!: Suplier;

    selectedSupliers!: Suplier[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private supliersService: SupliersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.supliersService.supliers$.subscribe((data) => {
            this.supliers = data;
        });
        this.supliersService.getSupliers().subscribe();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.submitted = false;
        this.suplierDialog = true;
    }

    editSuplier(suplier: Suplier) {
        this.suplier = { ...suplier };
        this.suplierDialog = true;
    }

    deleteSelectedSupliers() {
        this.confirmationService.confirm({
            message: 'Você tem certeza que quer deletar os fornecedores selecionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedSupliers?.forEach(suplier => {
                    this.supliersService.deleteSuplier(suplier.id!).subscribe(() => {
                        this.loadData();
                    });
                });
                this.selectedSupliers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Fornecedores Deletados',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.suplierDialog = false;
        this.submitted = false;
    }

    deleteSuplier(suplier: Suplier) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que quer deletar o fornecedor:  ' + suplier.code + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.supliersService.deleteSuplier(suplier.id!).subscribe(() => {
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Fornecedor Deletado',
                        life: 3000
                    });
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.supliers.length; i++) {
            if (this.supliers[i].id === Number(id)) {
                index = i;
                break;
            }
        }

        return index;
    }

    saveSuplier() {
        this.submitted = true;
        if (this.suplier.code?.trim()) {
            if (this.suplier.id) {
                this.supliersService.updateSuplier(this.suplier.id, this.suplier).pipe(
                    catchError((error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error,
                            life: 3000
                        });
                        return throwError(error);
                    })
                ).subscribe(() => {
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Fornecedor Atualizado',
                        life: 3000
                    });
                });
            } else {
                this.supliersService.createSuplier(this.suplier).pipe(
                    catchError((error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error,
                            life: 3000
                        });
                        return throwError(error);
                    })
                ).subscribe(() => {
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Fornecedor Criado',
                        life: 3000
                    });
                });
            }

            this.suplierDialog = false;
            this.suplier = {};
        }
    }
}