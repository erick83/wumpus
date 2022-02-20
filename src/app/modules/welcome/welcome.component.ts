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

  constructor(
    private gpService: GameParametersService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const {dimensions, holesCant, arrowsCant} = this.parametersForm.value
    this.gpService.setParameters(dimensions, holesCant, arrowsCant)
    this.router.navigateByUrl('game')
  }

}
