import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { IBoxData } from 'src/app/models/models.interfaces';
import { GameParametersService } from 'src/app/services/game-parameters.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription()
  board: IBoxData[][] | null = null
  maxLen = 0

  constructor(
    private gpService: GameParametersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.gpService.board$.subscribe(data => {
      if (!data) {
        this.router.navigateByUrl('')
      } else {
        this.board = data
        this.maxLen = data?.length || 0
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
