import { TestBed } from '@angular/core/testing';
import { GameParametersService } from './game-parameters.service';

describe('GameParametersService', () => {
  let service: GameParametersService;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameParametersService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('should be set parameters', () => {
    service.setParameters(4, 2, 1)

    service.parameter$.subscribe((data) => {
      expect(data?.dimensions).toBe(4)
      expect(data?.holesCant).toBe(2)
      expect(data?.arrowsCant).toBe(1)
    })
  })

  it('should call board', () => {
    service.board$.subscribe((data) => {
      expect(data).toBeNull()
    })
  })

});
