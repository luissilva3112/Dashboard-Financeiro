import { Injectable, signal, computed, effect } from '@angular/core';

// Estrutura para Transação
export interface Transaction {
  id: number;
  description: string;
  value: number
  type: 'income' | 'expense'; // entrada ou saída
  category: string;
  date: string;
}

export type FilterType = 'all' | 'income' | 'expense';

// Categoria para o filtro
export const CATEGORIES = [
  { id: 'food', label: 'Alimentação', icon: '🍎' },
  { id: 'transport', label: 'Transporte', icon: '🚗' },
  { id: 'leisure', label: 'Lazer', icon: '🎮' },
  { id: 'salary', label: 'Salário', icon: '💰' },
  { id: 'other', label: 'Outros', icon: '📦' }
];

@Injectable({
  providedIn: 'root',
})

export class Finance {
  // Signal privado com a lista de transações
  private transactionsSignal = signal<Transaction[]>(this.loadFromLocalStorage());

  // Sinal para controlar o filtro ativo
  filterSignal = signal<FilterType>('all');

  filteredTransactions = computed(() => {
    let list = this.transactionsSignal();
    const type = this.typeFilter();  
    if (type !== 'all') {
      list = list.filter(t => t.type === type);
    }
 
    const query = this.searchFilter().toLowerCase();

    if (!query) return list;

    return list.filter(t => {
      const matchDescription = t.description.toLowerCase().includes(query);
      const matchCategory = t.category.toLowerCase().includes(query);
      const matchValue = t.value.toString().includes(query);

      return matchDescription || matchCategory || matchValue;
    });
  });

  // Busca por Nome Transação
  private searchFilter = signal('');

  setSearchFilter(query: string) {
    this.searchFilter.set(query.toLowerCase());
  }

  // Filtro Histórico de Transações
  private typeFilter = signal<'all' | 'income' | 'expense'>('all');

  setTypeFilter(type: 'all' | 'income' | 'expense') {
    this.typeFilter.set(type);
  }

  transactions = computed(() => this.transactionsSignal());

  totalBalance = computed(() => {
    return this.transactionsSignal().reduce((acc, t) =>
      t.type === 'income' ? acc + t.value : acc - t.value, 0
    );
  });

  // Entradas (income)
  totalIncomes = computed(() =>
    this.transactions().filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0)
  );

  // Saídas (expense)
  totalExpenses = computed(() =>
    this.transactions().filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0)
  );

  // Pendentes
  totalPending = computed(() => 0)

  constructor() {
    // Sempre que transactionsSignal mudar, este código executa
    effect(() => {
      localStorage.setItem('my_finances', JSON.stringify(this.transactionsSignal()));
    });
  }

  // Função que ajuda carregar os dados ao iniciar o app
  private loadFromLocalStorage(): Transaction[] {
    const data = localStorage.getItem('my_finances');
    return data ? JSON.parse(data) : [];
  }

  addTransaction(transaction: Transaction) {
    this.transactionsSignal.update(current => [transaction, ...current]);
  }

  removeTransaction(id: number) {
    this.transactionsSignal.update(transactions =>
      transactions.filter(t => t.id !== id)
    );
  }
  // Função para limpar tudo (útil para testes)
  clearAll() {
    this.transactionsSignal.set([]);
  }
}
