import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBoxData, IParameters, TBoardCluesTypes } from '../models/models.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameParametersService {
  #parametersSubect = new BehaviorSubject<IParameters | null>(null)
  #boardSubject = new BehaviorSubject<IBoxData[][] | null>(null)

  get parameter$() {
    return this.#parametersSubect.asObservable()
  }

  get board$() {
    return this.#boardSubject.asObservable()
  }

  constructor() {
    this.parameter$.subscribe(this.initParameter.bind(this))
  }

  setParameters(dimensions:number, holesCant:number, arrowsCant:number) {
    this.#parametersSubect.next({dimensions, holesCant, arrowsCant})
  }

  private initParameter(data: IParameters | null) {
    if (data) {
      const board  = this.generateBoard(data.dimensions, data.holesCant);
      this.#boardSubject.next(board);
    }
  }

  private generateBoard(dimensions: number, holes: number): IBoxData[][] {
    const data = {
      hasGold: false,
      hasWumpu: false,
      hasHole: false,
      hasWind: false,
      hasSmell: false,
      hasPristine: true,
    };

    const emptyBoard = new Array(dimensions).fill(new Array(dimensions).fill(undefined));

    const board = emptyBoard.map(i => {
      return [...i].map(() => ({...data}))
    })

    let h = holes + 2;
    const acums: string[] = []

    while (h > 0) {
      const row = Math.floor(Math.random() * dimensions)
      const col = Math.floor(Math.random() * dimensions)

      if (row + col > 2 && !acums.includes(`${row}-${col}`)) {
        if (h === 1) {
          board[row][col].hasGold = true
        } else if (h === 2) {
          board[row][col].hasWumpu = true
          this.setClues(board, row, col, 'hasSmell');
        } else {
          board[row][col].hasHole = true
          this.setClues(board, row, col, 'hasWind');
        }

        acums.push(`${row}-${col}`)
        h = h - 1
      }

    }

    return board;
  }

  private setClues(board: IBoxData[][], row: number, col: number, type: TBoardCluesTypes) {
    const dimensions = board.length

    if (col + 1 < dimensions) {
      board[row][col + 1][type] = true
    }

    if (row + 1 < dimensions) {
      board[row + 1][col][type] = true
    }

    if (row - 1 >= 0) {
      board[row - 1][col][type] = true
    }

    if (col - 1 >= 0) {
      board[row][col - 1][type] = true
    }
  }
}
