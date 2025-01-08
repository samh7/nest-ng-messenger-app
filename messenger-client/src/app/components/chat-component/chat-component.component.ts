import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-chat-component',
  imports: [],
  templateUrl: './chat-component.component.html',
  styles: ``
})
export class ChatComponentComponent {
  displayOnly = input(false)
  isSender = input(false)
  clicked = signal(false)
  moreOptionsClicked = signal(false)
  text = input("Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae dicta dignissimos voluptates voluptate, nam eaque quidem repellendus")
  toggleMoreOptionsClicked() {
    this.moreOptionsClicked.update((value) => !value)
  }
  toggleClicked() {

    this.clicked.update((value) => !value)

  }
}
