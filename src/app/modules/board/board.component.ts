import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IBoxData, IUserPosition } from 'src/app/models/models.interfaces';
import { GameParametersService } from 'src/app/services/game-parameters.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription()
  private hunterPosition: IUserPosition = {col: 0, row: 0 }

  board: IBoxData[][] | null = null
  maxLen = 0

  constructor(
    private gpService: GameParametersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.gpService.board$.subscribe(data => {
      if (!data) {
        this.router.navigateByUrl('')
      } else {
        this.board = [...data].reverse()
        this.maxLen = data?.length || 0
        this.hunterPosition = { row: this.maxLen - 1, col: 0 }
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  showHunter(row:number, col:number ) {
    if (col === this.hunterPosition.col && row === this.hunterPosition.row) {
      if (this.board && this.board[col] && this.board[col][row]) {
        this.board[col][row].hasPristine = false
      }
      return true
    }
    return false
  }

}
