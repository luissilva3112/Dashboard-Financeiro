import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Importações necessárias para navegação
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'finance-dashboard';
}