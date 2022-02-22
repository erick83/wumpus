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
  private boardSubscription: Subscription = new Subscription()
  private parameterSubscription: Subscription = new Subscription()
  hunterPosition: IUserPosition = {col: 0, row: 0 }
  bulletPosition: IUserPosition = {col: 0, row:0}

  board: IBoxData[][] | null = null
  maxLen = 0
  hadGold = false
  gameOver = false
  showAlert = false
  showModal = false
  youWin = false
  fireActive = false
  textAlert = ''
  textModal = ''
  numberBullets = 0
  constructor(
    private gpService: GameParametersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.boardSubscription = this.gpService.board$.subscribe(data => {
      if (!data) {
        this.router.navigateByUrl('')
      } else {
        this.board = [...data].reverse()
        this.board[3][0].hasPristine = false
        this.maxLen = data?.length || 0
        this.hunterPosition = { row: this.maxLen - 1, col: 0 }
        this.bulletPosition = { row: this.maxLen - 1, col: 0 }
      }
    })
    this.parameterSubscription = this.gpService.parameter$.subscribe(data => {
      if(data) {
        this.numberBullets = data.arrowsCant
      }
    })
  }

  ngOnDestroy(): void {
    this.boardSubscription.unsubscribe()
    this.parameterSubscription.unsubscribe()
  }

  showHunter(row: number, col: number) {
    if (col === this.hunterPosition.col && row === this.hunterPosition.row) {
      return true
    }
    return false
  }
  showBullet(row: number, col: number) {
    if (col === this.bulletPosition.col && row === this.bulletPosition.row) {
      return true
    }
    return false
  }

  clickArrow (evt:string ='') {
    if (this.fireActive) {
      this.fireBulletDirection(evt)
    } else {
      this.moveHunter(evt)
    }
  }

  moveHunter(evt:string) {
    this.showAlert = false
    if (this.hadGold
        && this.board
        && this.board[this.hunterPosition.row]
        && this.board[this.hunterPosition.row][this.hunterPosition.col]) {
      this.board[this.hunterPosition.row][this.hunterPosition.col].hasGold = false
    }

    if (evt === 'up' && this.hunterPosition.row > 0) {
      this.hunterPosition.row = this.hunterPosition.row - 1
    } else if (evt === 'right' &&  this.hunterPosition.col < this.maxLen - 1) {
      this.hunterPosition.col =  this.hunterPosition.col + 1
    } else if (evt === 'down' && this.hunterPosition.row < this.maxLen - 1) {
      this.hunterPosition.row = this.hunterPosition.row + 1
    } else if (evt === 'left' && this.hunterPosition.col > 0) {
      this.hunterPosition.col = this.hunterPosition.col-1
    } else {
      this.textAlert = 'Has chocado con una pared'
      this.showAlert = true
      this.hitSound()
    }
    this.bulletPosition = {...this.hunterPosition}
    let positionActual = null
    if (this.board && this.board[this.hunterPosition.row] && this.board[this.hunterPosition.row][this.hunterPosition.col]) {
      positionActual = this.board[this.hunterPosition.row][this.hunterPosition.col]
      positionActual.hasPristine = false
      if (this.hunterPosition.row === this.maxLen - 1 && this.hunterPosition.col === 0 && this.hadGold){
        this.textModal = 'Has ganado el juego'
        this.youWin = true
        this.showModal = true
      }
      if (positionActual?.hasHole === true) {
        this.textModal = 'Has caido en un pozo'
        this.showModal = true
        this.gameOver = true
        this.holeSound()
      }
      if (positionActual?.hasWumpu === true) {
        this.textModal = 'Has sido victima del Wumpu'
        this.showModal = true
        this.gameOver = true
        this.monsterSound()
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

  fireBulletDirection(evt:string){
    if (this.numberBullets > 0) {
      this.intervalBullet(evt).then((interval) => {
        clearInterval(interval)
        this.fireActive = false
        this.bulletPosition = {...this.hunterPosition}
      })
    }
    this.numberBullets = this.numberBullets -1
  }

  fireBullet () {
    this.fireActive = !this.fireActive
  }

  closeAlert() {
    this.showAlert = false
    if (this.gameOver || this.youWin) {
      this.victorySound()
      this.router.navigateByUrl('/')
    }
  }

  goToNewGame() {
    this.router.navigateByUrl('')
  }

  private intervalBullet(evt:string): Promise<any> {
    this.bulletPosition = {...this.hunterPosition}
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (evt === 'up' && this.bulletPosition.row > 0) {
          this.bulletPosition.row = this.bulletPosition.row - 1
        } else if (evt === 'right' &&  this.bulletPosition.col < this.maxLen - 1) {
          this.bulletPosition.col =  this.bulletPosition.col + 1
        } else if (evt === 'down' && this.bulletPosition.row < this.maxLen - 1) {
          this.bulletPosition.row = this.bulletPosition.row + 1
        } else if (evt === 'left' && this.bulletPosition.col > 0) {
          this.bulletPosition.col = this.bulletPosition.col-1
        } else {
          resolve(interval)
        }
        if (this.board && this.board[this.bulletPosition.row] && this.board[this.bulletPosition.row][this.bulletPosition.col]) {
          let bulletActual = this.board[this.bulletPosition.row][this.bulletPosition.col]
          if (bulletActual?.hasWumpu === true) {
            this.wumpuDieSound()
            this.textAlert = 'Has matado al Wumpu'
            this.showAlert = true
            this.board[this.bulletPosition.row][this.bulletPosition.col].hasWumpu = false
            //ELIMINAR HEDOR
            if (this.board && this.board[this.bulletPosition.row] && this.board[this.bulletPosition.row][this.bulletPosition.col]) {
              this.board[this.bulletPosition.row][this.bulletPosition.col].hasSmell = false
            }
            if (this.board && this.board[this.bulletPosition.row-1] && this.board[this.bulletPosition.row-1][this.bulletPosition.col]) {
              this.board[this.bulletPosition.row-1][this.bulletPosition.col].hasSmell = false
            }
            if(this.board && this.board[this.bulletPosition.row+1] && this.board[this.bulletPosition.row+1][this.bulletPosition.col]){
              this.board[this.bulletPosition.row+1][this.bulletPosition.col].hasSmell = false
            }
            if (this.board && this.board[this.bulletPosition.row] && this.board[this.bulletPosition.row][this.bulletPosition.col+1]) {
              this.board[this.bulletPosition.row][this.bulletPosition.col+1].hasSmell = false
            }
            if (this.board && this.board[this.bulletPosition.row] && this.board[this.bulletPosition.row][this.bulletPosition.col-1]) {
              this.board[this.bulletPosition.row][this.bulletPosition.col-1].hasSmell = false
            }
          }
        }
      }, 200)
    })
  }

  private holeSound() {
    const sound = new Audio()
    sound.src = 'assets/sounds/falling.wav'
    sound.load()
    sound.play()
  }

  private monsterSound() {
    const sound = new Audio()
    sound.src = 'assets/sounds/monster.wav'
    sound.load()
    sound.play()
  }

  private wumpuDieSound() {
    const sound = new Audio()
    sound.src = 'assets/sounds/wumpu-die.wav'
    sound.load()
    sound.play()
  }

  private victorySound() {
    const sound = new Audio()
    sound.src = 'assets/sounds/victory.wav'
    sound.load()
    sound.play()
  }

  private hitSound() {
    const sound = new Audio()
    sound.src = 'assets/sounds/hit.wav'
    sound.load()
    sound.play()
  }
}
