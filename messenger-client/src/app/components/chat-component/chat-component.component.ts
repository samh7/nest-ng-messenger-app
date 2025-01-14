import { Component, input, OnInit, output, signal } from '@angular/core';
import { UtcToLocalTimePipe } from '../../pipes/utc-to-localtime.pipe';

@Component({
  selector: 'app-chat-component',
  imports: [
    UtcToLocalTimePipe
  ],
  templateUrl: './chat-component.component.html',
  styles: ``
})
export class ChatComponentComponent  {

  displayOnly = input(false)

  isSender = input(false)

  clicked = signal(false)


  moreOptionsClickedInput = input(false)


  moreOptionsClickedEvent = output()


  timeSend = input("")

  text = input("Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae dicta dignissimos voluptates voluptate, nam eaque quidem repellendus")

  delete = output()




  toggleMoreOptionsClicked() {

    // this.moreOptionsClicked.update((value) => !value)
    this.moreOptionsClickedEvent.emit()

  }

  toggleClicked() {

    this.clicked.update((value) => !value)
  }

  deleteMessage() {

    this.delete.emit()

  }
}
