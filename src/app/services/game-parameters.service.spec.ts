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
    service.setParameters(1, 1, 1)

    service.parameter$.subscribe((data) => {
      expect(data?.holesCant).toBe(1)
      expect(data?.dimensions).toBe(1)
      expect(data?.arrowsCant).toBe(1)
    })
  })
});
