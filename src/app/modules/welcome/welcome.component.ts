import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameParametersService } from 'src/app/services/game-parameters.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
	parametersForm = this.fb.group({
    dimensions : ['', Validators.required],
    holesCant : ['', Validators.required],
    arrowsCant : ['', Validators.required],
  })

  showAlert = false
  textAlert = ''

  constructor(
    private gpService: GameParametersService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const {dimensions, holesCant, arrowsCant} = this.parametersForm.value

    if (dimensions <= holesCant) {
      this.textAlert = 'El tablero deben ser mayores que la cantidad de hoyos'
      this.showAlert = true
    } else if (dimensions < 4) {
      this.textAlert = 'El tablero es muy pequeño, debe ser mayor a 4 casillas'
      this.showAlert = true
    } else {
      this.gpService.setParameters(dimensions, holesCant, arrowsCant)
      this.router.navigateByUrl('game')
    }
  }

  closeAlert() {
    this.showAlert = false
  }
}
