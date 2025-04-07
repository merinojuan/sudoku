import { Pipe, PipeTransform } from '@angular/core';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

@Pipe({
  name: 'difficultyName'
})
export class DifficultyNamePipe implements PipeTransform {

  transform(value: Difficulty): string {
    if (value === 'easy') return 'Fácil';
    if (value === 'medium') return 'Moderado';
    if (value === 'hard') return 'Difícil';
    if (value === 'expert') return 'Experto';
    return '???';
  }

}
