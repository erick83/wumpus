import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBoxData, IParameters } from '../models/models.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameParametersService {

  #parametersSubect = new BehaviorSubject<IParameters|null>(null)

  get parameter$() {
    return this.#parametersSubect.asObservable()
  }

  constructor() {
    this.parameter$.subscribe((data) => {
      if (data) {
        this.initParameter(data);
      }
    })
  }

  setParameters(dimensions:number, holesCant:number, arrowsCant:number) {
    this.#parametersSubect.next({dimensions, holesCant, arrowsCant})
  }

  private initParameter(params: IParameters) {
    const board  = this.generateBoard(params.dimensions, params.holesCant);
    console.log(board);
  }

  private generateBoard(dimensions: number, holes: number): IBoxData[][] {
    const data = {
      hasGold: false,
      hasWumpu: false,
      hasHole: false,
      hasWind: false,
      hasSmell: false,
      hasPristine: false,
    };

    const board = new Array(dimensions)
    .fill(new Array(dimensions).fill({
      hasGold: false,
      hasWumpu: false,
      hasHole: false,
      hasWind: false,
      hasSmell: false,
      hasPristine: false,
    }));

    console.log(board);

    let h = holes;
    // while (h > 0) {
    //   const row = Math.floor(Math.random() * dimensions)
    //   const col = Math.floor(Math.random() * dimensions)

    //   if (row + col > 2) {
    //     board[row][col].hasHole = true
    //     console.log(h, row, col)
    //     h = h - 1
    //   }
    // }

    return board;
  }
}
