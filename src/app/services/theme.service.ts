import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'cupcake' | 'bumblebee' | 'emerald' | 'corporate' | 'synthwave' | 'retro' | 'cyberpunk' | 'valentine' | 'halloween' | 'garden' | 'forest' | 'aqua' | 'lofi' | 'pastel' | 'fantasy' | 'wireframe' | 'black' | 'luxury' | 'dracula' | 'cmyk' | 'autumn' | 'business' | 'acid' | 'lemonade' | 'night' | 'coffee' | 'winter' | 'dim' | 'nord' | 'sunset' | 'caramellatte' | 'abyss' | 'silk';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly defaultTheme: Theme = 'light';
  private readonly currentTheme = signal<Theme>(this.defaultTheme);
  private readonly document = inject(DOCUMENT);
  
  readonly themes: Theme[] = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset', 'caramellatte', 'abyss', 'silk'
  ];

  constructor() {
    this.setTheme(this.getThemeFromLocalStorage());
  }

  getCurrentTheme() {
    return this.currentTheme.asReadonly();
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    this.setThemeInLocalStorage(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private setThemeInLocalStorage(theme: Theme) {
    localStorage.setItem('theme', theme);
  }

  private getThemeFromLocalStorage() {
    return localStorage.getItem('theme') as Theme ?? this.defaultTheme;
  }
}
