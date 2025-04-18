import { Component, inject, model, HostListener, AfterViewInit, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import clone from 'just-clone';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { Theme, ThemeService } from './services/theme.service';
import { Sudoku, SudokuCell, SudokuService } from './services/sudoku.service';
import { FontSizePipe } from './pipes/font-size.pipe';
import { DifficultyNamePipe } from './pipes/difficulty-name.pipe';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, FontSizePipe, DifficultyNamePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {
  readonly themeService = inject(ThemeService);
  readonly sudokuService = inject(SudokuService);

  selectedInputValue = model<number | null>(null);

  height = 0;
  @ViewChild('box') boxElement: ElementRef | undefined;

  @ViewChild('dropdownsBlur') dropdownsBlurElement: ElementRef | undefined;

  history: Sudoku[] = [];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.height = this.boxElement?.nativeElement.offsetWidth;
    }, 0);
  }

  ngOnInit() {
    this.getSudoku();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.height !== this.boxElement?.nativeElement.offsetWidth) this.height = this.boxElement?.nativeElement.offsetWidth;
  }

  setTheme(theme: Theme) {
    this.dropdownsBlurElement?.nativeElement.focus();
    this.themeService.setTheme(theme);
  }

  setDifficulty(difficulty: Difficulty) {
    this.dropdownsBlurElement?.nativeElement.focus();
    this.sudokuService.setDifficulty(difficulty);
    this.getSudoku();
  }

  getSudoku() {
    if (this.selectedInputValue()) this.selectedInputValue.set(null);
    this.history = [this.sudokuService.getSudoku(this.sudokuService.getCurrentDifficulty()())];
  }

  resetSudoku() {
    if (!this.history?.length) return;

    if (this.selectedInputValue()) this.selectedInputValue.set(null);
    this.history = [this.history[0]];
  }

  undoLastMovement() {
    if (!this.history?.length) return;
    this.history.pop();
  }

  setValue(position: number, cell: SudokuCell, e?: Event) {
    if (e) e.preventDefault();

    const currentSudoku = clone(this.history.at(-1)!);
    if (
      !currentSudoku
      || !this.selectedInputValue()
      || !cell.isEditable
      || !this.history.length
    ) return;

    if (!e) {
      if (cell.setedValue && cell.setedValue === this.selectedInputValue()) {
        currentSudoku.cells.set(position, {
          ...cell,
          setedValue: null,
        });
      } else {
        if (!currentSudoku.values.get(this.selectedInputValue()!)) return;

        cell.relatedPositions.forEach((relatedPosition) => {
          const currentSudokuPossibleValues = currentSudoku.cells.get(relatedPosition)?.possibleValues;
          if (currentSudokuPossibleValues?.length && currentSudokuPossibleValues.includes(this.selectedInputValue()!)) {
            currentSudoku.cells.get(relatedPosition)?.possibleValues?.splice(currentSudokuPossibleValues.indexOf(this.selectedInputValue()!), 1);
          }
        });
  
        currentSudoku.cells.set(position, {
          ...cell,
          setedValue: this.selectedInputValue(),
        });
    
        const remainingValue = (currentSudoku.values.get(this.selectedInputValue()!) ?? 0) - 1;
        currentSudoku.values.set(this.selectedInputValue()!, remainingValue);

        if (!remainingValue) this.selectedInputValue.set(null);
      }

      const replacedValue = cell.setedValue;
      if (replacedValue) {
        currentSudoku.values.set(replacedValue, (currentSudoku.values.get(replacedValue) ?? 0) + 1);
      }
    } else {
      if (cell.setedValue) return;

      currentSudoku.cells.set(position, {
        ...cell,
        possibleValues: cell.possibleValues.includes(this.selectedInputValue()!)
          ? cell.possibleValues.filter((value) => value !== this.selectedInputValue())
          : [...cell.possibleValues, this.selectedInputValue()!],
      });
    }

    const toCompletedCells = [...currentSudoku.cells.values()].filter(c => c.isEditable);
    if (toCompletedCells.every(c => !!c.setedValue)) {
      currentSudoku.isCompleted = true;
      currentSudoku.isResolved = toCompletedCells.every(c => c.value === c.setedValue);
    }

    this.history.push(currentSudoku);
  }

  setSelectedInputValue(value: number) {
    this.selectedInputValue.set(value);
  }
}
