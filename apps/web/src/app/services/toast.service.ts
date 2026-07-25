import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly messagesSignal = signal<ToastMessage[]>([]);
  readonly messages = this.messagesSignal.asReadonly();

  private show(text: string, type: 'success' | 'error' | 'info', duration = 3000): void {
    const id = this.nextId++;
    this.messagesSignal.update(m => [...m, { id, text, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(text: string): void { this.show(text, 'success'); }
  error(text: string): void { this.show(text, 'error'); }
  info(text: string): void { this.show(text, 'info'); }

  dismiss(id: number): void {
    this.messagesSignal.update(m => m.filter(msg => msg.id !== id));
  }
}
