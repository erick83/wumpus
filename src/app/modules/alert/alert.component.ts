import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() text: string = ''
  @Output() onClose: EventEmitter<null> = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }

  closeEmitter() {
    this.onClose.emit()
  }

}
