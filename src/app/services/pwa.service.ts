import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private installPrompt = signal<any>(null);
  public canInstall = signal<boolean>(false);

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPrompt.set(event);
      this.canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.disableInstall();
    });
  }

  async installPwa() {
    const prompt = this.installPrompt();
    if (!prompt) return;

    await prompt.prompt();
    this.disableInstall();
  }

  private disableInstall() {
    this.installPrompt.set(null);
    this.canInstall.set(false);
  }
}
