import { Component, inject, viewChild, ElementRef, effect, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Finance, FilterType } from '../../services/finance';
import { Transactions } from '../transactions/transactions';
import { Toast } from '../../services/toast';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, Transactions],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  finance = inject(Finance);
  toast = inject(Toast);

  // Signals do serviço
  transactions = this.finance.transactions;
  totalBalance = this.finance.totalBalance;

  canvas = viewChild<ElementRef<HTMLCanvasElement>>('financeChart');
  chart?: Chart;

  constructor() {
    effect(() => {
      const data = this.finance.filteredTransactions();
      // Captura a referência do ViewChild
      const canvasEl = this.canvas();
      if (canvasEl && data.length > 0) {
        this.updateChart(data);
      } else if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
      }
    });
  }

  deleteTransaction(id: number) {
    if (confirm('Deseja excluir?')) {
      this.finance.removeTransaction(id);
      this.toast.show('Transação removida com sucesso!');
    }
  }

  // Signal para abrir/fechar o modal
  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  handleSucess() {
    this.closeModal();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.finance.setSearchFilter(query);
  }

  isSearchOpen = signal(false);

  // Filtro histórico transações
  isFilterOpen = signal(false);
  currentTypeFilter = signal<'all' | 'income' | 'expense'>('all');

  setFilter(type: 'all' | 'income' | 'expense') {
    this.currentTypeFilter.set(type);
    this.isFilterOpen.set(false); // Fecha o menu após selecionar
    this.finance.setTypeFilter(type); // Avisa o serviço
  }

  getIcon(category: string): string {
    const icons: Record<string, string> = {
      food: '🍎', transport: '🚗', leisure: '🎮', salary: '💰', other: '📦'
    };
    return icons[category] || '📦';
  }

  updateChart(transactions: any[]) {
    const ctx = this.canvas()?.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    // Se não houver dados, criamos o gráfico "fantasma"
    const isDataEmpty = transactions.length === 0;

    const dataValues = isDataEmpty ? [100] : [
      transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.value, 0),
      transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.value, 0)
    ];

    const backgroundColors = isDataEmpty ? ['#f0f2f5'] : ['#2ecc71', '#e74c3c'];
    const labels = isDataEmpty ? ['Sem dados'] : ['Entradas', 'Saídas'];

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 0
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { display: !isDataEmpty, position: 'bottom' },
          tooltip: { enabled: !isDataEmpty }
        }
      }
    });
  }
}