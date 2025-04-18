import { Injectable, signal } from '@angular/core';
import { getSudoku as getSudokuGen } from 'sudoku-gen';
import { Sudoku as SudokuGen } from 'sudoku-gen/dist/types/sudoku.type';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { cells, values } from '../app.constants';

export type SudokuCell = {
  isEditable: boolean;
  relatedPositions: number[];
  value: number | null;
  setedValue: number | null;
  possibleValues: number[];
  cssClass: string;
};

export type SudokuValue = Map<number, number>;

export type Sudoku = {
  isCompleted: boolean;
  isResolved: boolean;
  cells: Map<number, SudokuCell>;
  values: SudokuValue;
};

@Injectable({
  providedIn: 'root'
})
export class SudokuService {
  private readonly defaultDifficulty: Difficulty = 'easy';
  private readonly currentDifficulty = signal<Difficulty>(this.defaultDifficulty);

  readonly difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  constructor() {
    this.setDifficulty(this.getDifficultyFromLocalStorage());
  }

  getCurrentDifficulty() {
    return this.currentDifficulty.asReadonly();
  }

  setDifficulty(difficulty: Difficulty) {
    this.currentDifficulty.set(difficulty);
    this.setDifficultyInLocalStorage(difficulty);
  }

  private setDifficultyInLocalStorage(difficulty: Difficulty) {
    localStorage.setItem('difficulty', difficulty);
  }

  private getDifficultyFromLocalStorage() {
    return localStorage.getItem('difficulty') as Difficulty ?? this.defaultDifficulty;
  }

  getSudoku(difficulty: Difficulty) {
    const sudokuGen = getSudokuGen(difficulty) as SudokuGen;
    const puzzleArray = sudokuGen.puzzle.split('');
    const solutionArray = sudokuGen.solution.split('');
    return {
      isCompleted: false,
      isResolved: false,
      cells: this.getCells(puzzleArray, solutionArray),
      values: this.getValues(puzzleArray),
    };
  }

  private getCells(puzzle: string[], solution: string[]): Map<number, SudokuCell> {
    return new Map(cells.map(([position, relatedPositions, cssClass]) => [
      position,
      {
        relatedPositions,
        cssClass,
        isEditable: puzzle[position - 1] === '-',
        value: +solution[position - 1],
        setedValue: null,
        possibleValues: [],
      }
    ]));
  }

  private getValues(puzzle: string[]): SudokuValue {
    return new Map(values.map((value) => [
      value,
      (9 - puzzle.filter(v => v !== '-' && value === +v).length),
    ]));
  }
}
