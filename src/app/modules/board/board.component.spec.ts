import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IBoxData, TBoardCluesTypes } from 'src/app/models/models.interfaces';
import { GameParametersService } from 'src/app/services/game-parameters.service';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent
  let fixture: ComponentFixture<BoardComponent>
  let fakeGameService: GameParametersService
  const board: IBoxData[][] = []

  console.log(generateBoard())

  beforeEach(async () => {
    fakeGameService = jasmine.createSpyObj<GameParametersService>(
      'GameParametersService',
      {},
      {
        board$: of(generateBoard())
      }
    )

    await TestBed.configureTestingModule({
      declarations: [
        BoardComponent,
      ],
      imports: [
        CommonModule,
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
