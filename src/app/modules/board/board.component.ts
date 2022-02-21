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
  hunterPosition: IUserPosition = {col: 0, row: 0 }

  board: IBoxData[][] | null = null
  maxLen = 0
  hadGold = false
  gameOver = false
  showAlert = false
  showModal = false
  youWin = false
  textAlert = ''
  textModal = ''
  numberBullets = 0
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
    this.gpService.parameter$.subscribe(data => {
      if(data) {
        this.numberBullets = data.arrowsCant
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  showHunter(row:number, col:number ) {
    if (col === this.hunterPosition.col && row === this.hunterPosition.row) {
      return true
    }
    return false
  }

  moveHunter(evt:string) {
    this.showAlert = false
    if (this.hadGold) {
      if (this.board && this.board[this.hunterPosition.row] && this.board[this.hunterPosition.row][this.hunterPosition.col]) {
        this.board[this.hunterPosition.row][this.hunterPosition.col].hasGold = false
      }
    }
    switch (evt) {
      case 'up':
        if(this.hunterPosition.row > 0){
          this.hunterPosition.row = this.hunterPosition.row-1
        } else {
          this.textAlert = 'Has chocado con una pared'
          this.showAlert = true
        }
      break;
      case 'right':
        if(this.hunterPosition.col < this.maxLen - 1){
          this.hunterPosition.col = this.hunterPosition.col+1
        } else {
          this.textAlert = 'Has chocado con una pared'
          this.showAlert = true
        }
          break;
      case 'down':
        if(this.hunterPosition.row < this.maxLen - 1){
          this.hunterPosition.row = this.hunterPosition.row+1
        } else {
          this.textAlert = 'Has chocado con una pared'
          this.showAlert = true
        }
      break;
      case 'left':
        if(this.hunterPosition.col > 0){
          this.hunterPosition.col = this.hunterPosition.col-1
        } else {
          this.textAlert = 'Has chocado con una pared'
          this.showAlert = true
        }
      break;
    default:
      break;
   }
   let positionActual = null
   if (this.board && this.board[this.hunterPosition.row] && this.board[this.hunterPosition.row][this.hunterPosition.col]) {
      positionActual = this.board[this.hunterPosition.row][this.hunterPosition.col]
      positionActual.hasPristine = false
      console.log(this.hunterPosition, positionActual.hasGold)
      if (this.hunterPosition.row === this.maxLen - 1 && this.hunterPosition.col === 0 && this.hadGold){
        this.textModal = 'Has ganado el juego'
        this.youWin = true
        this.showModal = true
      }
      if (positionActual?.hasHole === true) {
        this.textModal = 'Has caido en un pozo'
        this.showModal = true
        this.gameOver = true
      }
      if (positionActual?.hasWumpu === true) {
        this.textModal = 'Has sido victima del Wumpu'
        this.showModal = true
        this.gameOver = true
      }
      if (positionActual?.hasGold === true) {
          this.hadGold = positionActual.hasGold = true
          this.textAlert = 'Has capturado el oro'
          this.showAlert = true
      }
      if (this.hadGold && positionActual.hasPristine === false) {
        positionActual.hasGold = true
      }
    }
  }
  closeAlert() {
    this.showAlert = false
    if (this.gameOver || this.youWin) {
      this.router.navigateByUrl('/')
    }
  }

  goToNewGame() {
    this.router.navigateByUrl('')
  }

}
