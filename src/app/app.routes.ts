import { Routes } from '@angular/router';
import { MainComponent } from './layout/components/main/main.component';
import { ProductsComponent } from './features/products/products.component';
import { SupliersComponent } from './features/supliers/supliers.component';
import { NotasFiscaisComponent } from './features/notas-fiscais/notas-fiscais.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {path: 'produtos', component: ProductsComponent},
            {path: 'fornecedores', component: SupliersComponent},
            {path: 'notas-fiscais', component: NotasFiscaisComponent}
        ]
    },
];
