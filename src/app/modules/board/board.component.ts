import { Component, OnInit } from '@angular/core';
import { IBoxData } from 'src/app/models/models.interfaces';
import { GameParametersService } from 'src/app/services/game-parameters.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: IBoxData[][] | null = null
  maxLen = 0
  constructor(private gpService: GameParametersService) { }

  ngOnInit(): void {
    this.gpService.board$.subscribe(data => {
      this.board = data
      this.maxLen = data?.length || 0
    })
  }

}
