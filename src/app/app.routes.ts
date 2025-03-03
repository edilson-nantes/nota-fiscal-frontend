import { Routes } from '@angular/router';
import { MainComponent } from './layout/components/main/main.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            
        ]
    },
];
