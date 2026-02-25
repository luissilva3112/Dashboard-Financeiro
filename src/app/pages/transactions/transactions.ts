import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Finance } from '../../services/finance';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  private fb = inject(FormBuilder);
  private finance = inject(Finance);
  private toast = inject(Toast);  

  transactionForm = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(3)]],
    value: [0, [Validators.required, Validators.min(0.01)]],
    type: ['income', Validators.required],
    category: ['other']
  });

  onSaveSuccess = output<void>();

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;

      this.finance.addTransaction({
        id: Date.now(),
        description: formValue.description!,
        value: formValue.value!,
        type: formValue.type as 'income' | 'expense',
        category: formValue.category!,
        date: new Date().toISOString()
      });

      this.toast.show('Transação adicionada com sucesso!', 'success');

      this.transactionForm.reset({
        type: 'income',
        value: 0,
        description: '',
        category: 'other'
      });
    } else {
      this.toast.show('Preencha os campos corretamente', 'error');
    }
  }
}
