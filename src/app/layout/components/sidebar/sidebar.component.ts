import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Produtos', icon: 'pi pi-fw pi-tag', link: '/produtos' },
    { label: 'Fornecedores', icon: 'pi pi-fw pi-id-card', link: '/fornecedores' },
    { label: 'Notas Fiscais', icon: 'pi pi-fw pi-pen-to-square', link: '/notas-fiscais' }
  ]
}
