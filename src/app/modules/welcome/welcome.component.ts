import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  constructor(
    private gp: GameParametersService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const {dimensions, holesCant, arrowsCant} = this.parametersForm.value
    this.gp.setParameters(dimensions, holesCant, arrowsCant)
  }

}
