import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Observer, Subject, Subscription } from 'rxjs';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { IBoxData, IUserPosition } from 'src/app/models/models.interfaces';
import { GameParametersService } from 'src/app/services/game-parameters.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription()
  private keyListener: BehaviorSubject<string> = new BehaviorSubject('')
  private hunterPositionListener: BehaviorSubject<IUserPosition> = new BehaviorSubject({col:0,row:0})

  board: IBoxData[][] | null = null
  maxLen = 0
  get hunterPosition$(): Observable<IUserPosition> {
    return this.hunterPositionListener.asObservable()
  }

  constructor(
    private gpService: GameParametersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.hunterPosition$.subscribe(console.log)
    this.subscription = this.gpService.board$.subscribe(data => {
      if (!data) {
        this.router.navigateByUrl('')
      } else {
        this.board = [...data].reverse()
        this.maxLen = data?.length || 0
        this.hunterPositionListener.next({col: 0,row: this.maxLen - 1})
        document.addEventListener('keydown',this.moveHunter.bind(this))
      }
    })
    this.keyListener.asObservable().subscribe(evt => {
      // console.log({evt})
      const hp = this.hunterPositionListener.getValue()
      switch (evt) {
        case 'w':
        case 'W':
        case 'ArrowUp':
          if(!hp.row) {
            this.hunterPositionListener.next({
              col: hp.col,
              row: hp.row - 1,
            })
          }
        break;
        case 'd':
        case 'D':
        case 'ArrowRight':
        break;
        case 's':
        case 'S':
        case 'ArrowDown':
        break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
        break;
        default:
          break;
      }
    })

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    document.removeEventListener('keydown',this.moveHunter)
  }

  showHunter(row:number, col:number ) {
    const hp = this.hunterPositionListener.getValue()
   if (col === hp.col && row === hp.row) {
      if (this.board && this.board[col] && this.board[col][row]) {
        this.board[col][row].hasPristine = false
      }
    return true
   }
   return false
  }

  moveHunter(event:KeyboardEvent) {
    console.log(event)
    this.keyListener.next(event.key)
  }


}
