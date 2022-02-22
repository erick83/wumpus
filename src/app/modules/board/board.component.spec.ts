import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IBoxData, TBoardCluesTypes } from 'src/app/models/models.interfaces';
import { GameParametersService } from 'src/app/services/game-parameters.service';
import { AlertModule } from '../alert/alert.module';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent
  let fixture: ComponentFixture<BoardComponent>
  let fakeGameService: GameParametersService
  const board: IBoxData[][] = []

  beforeEach(async () => {
    fakeGameService = jasmine.createSpyObj<GameParametersService>(
      'GameParametersService',
      {},
      {
        board$: of(generateBoard()),
        parameter$: of({
          dimensions: 4,
          holesCant: 1,
          arrowsCant: 0,
        })
      }
    )

    await TestBed.configureTestingModule({
      declarations: [
        BoardComponent,
      ],
      imports: [
        CommonModule,
        AlertModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: BoardComponent,
          }
        ])
      ],
      providers: [
        { provide: GameParametersService, useValue: fakeGameService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close alert', () => {
    component.showAlert = true
    expect(component.showAlert).toBeTrue()
    component.closeAlert()
    expect(component.showAlert).toBeFalse()
  })

  it('should show hunter', () => {
    expect(component.showHunter(3, 0)).toBeTrue()
  })

  it('should hide hunter', () => {
    expect(component.showHunter(1, 1)).toBeFalse()
  })

  it('should show bullet', () => {
    expect(component.showBullet(3, 0)).toBeTrue()
  })

  it('should hide bullet', () => {
    expect(component.showBullet(1, 1)).toBeFalse()
  })


  it('shoul move hunter up', () => {
    component.hunterPosition = {
      col: 0,
      row: 4,
    }

    const prevHunterPosition = component.hunterPosition.row
    const button = fixture.debugElement.query(By.css('.button-up'))
    button.nativeElement.click()

    expect(component.hunterPosition.row).toBe(prevHunterPosition - 1)
  })

  it('shoul move hunter down', () => {
    component.hunterPosition = {
      col: 0,
      row: 2,
    }

    const prevHunterPosition = component.hunterPosition.row
    const button = fixture.debugElement.query(By.css('.button-down'))
    button.nativeElement.click()

    expect(component.hunterPosition.row).toBe(prevHunterPosition + 1)
  })

  it('shoul move hunter right', () => {
    component.hunterPosition = {
      col: 0,
      row: 2,
    }

    const prevHunterPosition = component.hunterPosition.col
    const button = fixture.debugElement.query(By.css('.button-right'))
    button.nativeElement.click()

    expect(component.hunterPosition.col).toBe(prevHunterPosition + 1)
  })

  it('shoul move hunter left', () => {
    component.hunterPosition = {
      col: 2,
      row: 2,
    }

    const prevHunterPosition = component.hunterPosition.col
    const button = fixture.debugElement.query(By.css('.button-left'))
    button.nativeElement.click()

    expect(component.hunterPosition.col).toBe(prevHunterPosition - 1)
  })

  it('shoul move hunter to wall', () => {
    component.hunterPosition = {
      col: 0,
      row: 3,
    }

    const prevHunterPosition = component.hunterPosition.col
    const button = fixture.debugElement.query(By.css('.button-left'))
    button.nativeElement.click()

    expect(component.showAlert).toBeTrue()
    expect(component.textAlert).toBe('Has chocado con una pared')
  })

  // it('shoul move hunter fall', () => {
  //   component.hunterPosition = {
  //     row: 1,
  //     col: 2,
  //   }

  //   const method = spyOn(component, 'moveHunter')

  //   const button = fixture.debugElement.query(By.css('.button-right'))
  //   button.nativeElement.click()

  //   expect(method).toHaveBeenCalled()
  //   console.log(component)
  //   expect(component.showAlert).toBeTrue()
  //   expect(component.gameOver).toBeTrue()
  //   expect(component.textAlert).toBe('Has caido en un pozo')
  // })

  it('should fireBullet', () => {
    const active = component.fireActive
    component.fireBullet()
    expect(component.fireActive).toBe(!active)
  })

  it('should end the game', () => {
    component.gameOver = true
    const method = spyOn(component, 'victorySound')
    component.closeAlert()
    expect(method).toHaveBeenCalled()
  })

  it('should fire bullet', () => {
    const bullets = component.numberBullets = 5
    component.fireBulletDirection('up')
    expect(component.numberBullets).toBe(bullets - 1)
  })

  it('should call intervalBullet up', async () => {
    const dataUp = await component.intervalBullet('up')
    expect(dataUp).not.toBeNull()
  })

  it('should call intervalBullet right', async () => {
    component.bulletPosition.col = 2
    const dataRight = await component.intervalBullet('right')
    expect(dataRight).not.toBeNull()
  })

  it('should call intervalBullet left', async () => {
    component.bulletPosition.col = 2
    const dataLeft = await component.intervalBullet('left')
    expect(dataLeft).not.toBeNull()
  })
  it('should call intervalBullet down', async () => {
    component.bulletPosition.row = 5
    const dataDown = await component.intervalBullet('down')
    expect(dataDown).not.toBeNull()
  })
});


function generateBoard() {
  const dimensions = 4
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

  board[3][3].hasGold = true
  board[2][2].hasHole = true
  setClues(board, 2, 2, 'hasWind')
  board[2][3].hasWumpu = true
  setClues(board, 2, 3, 'hasSmell')

  return board
}

function setClues(board: IBoxData[][], row: number, col: number, type: TBoardCluesTypes) {
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
