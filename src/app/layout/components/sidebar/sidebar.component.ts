import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Produtos', icon: 'pi pi-fw pi-id-card', link: '/produtos' },
    { label: 'Fornecedores', link: '/fornecedores' },
    { label: 'Notas Fiscais', link: '/notas-fiscais' }
  ]
}
