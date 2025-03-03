import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from "../topbar/topbar.component";

@Component({
  selector: 'app-main',
  imports: [SidebarComponent, RouterOutlet, TopbarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
