import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IParameters } from '../models/models.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameParametersService {

  #parametersSubect = new BehaviorSubject<IParameters|null>(null)

  get parameter$() {
    return this.#parametersSubect.asObservable()
  }

  constructor() {
    this.parameter$.subscribe(console.log)
  }

  setParameters(dimensions:number, holesCant:number, arrowsCant:number) {
    this.#parametersSubect.next({dimensions, holesCant, arrowsCant})
  }
}
