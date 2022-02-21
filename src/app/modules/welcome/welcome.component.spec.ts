import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WelcomeComponent,

      ],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: WelcomeComponent
          }
        ])
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set params correct', () => {
    const dimensions = fixture.debugElement.query(By.css('input[formControlName=dimensions]'))
    const holesCant = fixture.debugElement.query(By.css('input[formControlName=holesCant]'))
    const arrowsCant = fixture.debugElement.query(By.css('input[formControlName=arrowsCant]'))
    const button = fixture.debugElement.query(By.css('.start-button'))

    dimensions.nativeElement.value = 8
    dimensions.nativeElement.dispatchEvent(new Event('input'))
    holesCant.nativeElement.value = 2
    holesCant.nativeElement.dispatchEvent(new Event('input'))
    arrowsCant.nativeElement.value = 1
    arrowsCant.nativeElement.dispatchEvent(new Event('input'))
    button.nativeElement.click()

    expect(component.showAlert).toBeFalse()
    expect(component.textAlert).toBe('')
  })

  it('should set board dimensions lesser to 4', () => {
    const dimensions = fixture.debugElement.query(By.css('input[formControlName=dimensions]'))
    const holesCant = fixture.debugElement.query(By.css('input[formControlName=holesCant]'))
    const arrowsCant = fixture.debugElement.query(By.css('input[formControlName=arrowsCant]'))
    const button = fixture.debugElement.query(By.css('.start-button'))

    dimensions.nativeElement.value = 3
    dimensions.nativeElement.dispatchEvent(new Event('input'))
    holesCant.nativeElement.value = 2
    holesCant.nativeElement.dispatchEvent(new Event('input'))
    arrowsCant.nativeElement.value = 1
    arrowsCant.nativeElement.dispatchEvent(new Event('input'))
    button.nativeElement.click()

    expect(component.showAlert).toBeTrue()
    expect(component.textAlert).toBe('El tablero es muy pequeño, debe ser mayor a 4 casillas')
  })

  it('should set holes cant greater than board', () => {
    const dimensions = fixture.debugElement.query(By.css('input[formControlName=dimensions]'))
    const holesCant = fixture.debugElement.query(By.css('input[formControlName=holesCant]'))
    const arrowsCant = fixture.debugElement.query(By.css('input[formControlName=arrowsCant]'))
    const button = fixture.debugElement.query(By.css('.start-button'))

    dimensions.nativeElement.value = 1
    dimensions.nativeElement.dispatchEvent(new Event('input'))
    holesCant.nativeElement.value = 1
    holesCant.nativeElement.dispatchEvent(new Event('input'))
    arrowsCant.nativeElement.value = 1
    arrowsCant.nativeElement.dispatchEvent(new Event('input'))
    button.nativeElement.click()


    expect(component.showAlert).toBeTrue()
    expect(component.textAlert).toBe('El tablero deben ser mayores que la cantidad de hoyos')

  })

  it('should close alert', () => {
    component.showAlert = true
    expect(component.showAlert).toBeTrue()
    component.closeAlert()
    expect(component.showAlert).toBeFalse()
  })
});
