import { Routes } from '@angular/router';
import { MainComponent } from './layout/components/main/main.component';
import { ProductsComponent } from './features/products/products.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {path: 'produtos', component: ProductsComponent},
        ]
    },
];
