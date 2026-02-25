import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class Toast {
  // Guardamos a mensagem e o tipo
  data = signal<{ msg: string, type: ToastType } | null>(null);

  show(msg: string, type: ToastType = 'success') {
    this.data.set({ msg, type });
    
    setTimeout(() => {
      this.data.set(null);
    }, 3000);
  }
}