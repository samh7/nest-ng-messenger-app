import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatComponentComponent } from "../../components/chat-component/chat-component.component";
import { MessagesService } from '../../services/messages.service';
import { Message } from '../../../shared/interfaces/message.interface';
import { SenderReceiverDto } from '../../../shared/interfaces/sender-receiver';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CreateMessageDto } from '../../../shared/interfaces/create-message.interface';
import { EventsService } from '../../services/events.service';
import { TypingDto } from '../../../shared/interfaces/typing-dto';

@Component({
  selector: 'app-chat',
  imports: [
    ChatComponentComponent,
    ReactiveFormsModule
  ],
  templateUrl: './chat.component.html',
  styles: ``
})
export class ChatComponent implements OnInit, AfterViewChecked {
  router = inject(Router)
  route = inject(ActivatedRoute)
  receiverName = signal<string | null>(null)
  messageService = inject(MessagesService)
  messages = signal<Message[]>([])
  authService = inject(AuthService)
  user = signal<User | null>(null)
  formBuilder = inject(FormBuilder)
  moreOptionShow = signal(false)
  messageForm = this.formBuilder.group({
    message: ["", [Validators.required]]
  })
  isReceiverTyping = signal(false)
  location = inject(Location)
  eventsService = inject(EventsService)
  private typingTimeout!: number
  cdr = inject(ChangeDetectorRef)
  private isScrolling = false
  fragmentValue = signal<string | null>(null)
  moreOptionsClickedVal = signal(false)

  isScrolled = false

  @ViewChild('messageContainer', { static: true }) messageContainer!: ElementRef;
  isUserInitiatedScroll = false;


  ngAfterViewChecked() {
    if (!this.isUserInitiatedScroll) {
      this.scrollToBottom();
    }
    this.cdr.detectChanges();

  }


  ngOnInit(): void {
    this.user.set(this.authService.getUserFromStorage()!)
    this.receiverName.set(this.route.snapshot.paramMap.get("name")!)

    let senderReceiverDto!: SenderReceiverDto

    if (this.receiverName()) {
      senderReceiverDto = {
        senderUsername: this.user()!.username!,
        receiverUsername: this.receiverName()!
      }
    }
    else {

      senderReceiverDto = {
        senderUsername: this.user()!.username!,
      }
    }

    this.eventsService.message$.subscribe((message: Message) => {

      if (message !== null) {

        if (
          message.receiverUsername === this.user()?.username &&
          message.senderUsername === this.receiverName()!
        ) {

          this.messages.update((messages) => [...messages, message])

        }
      }
    })


    this.eventsService.typing$.subscribe((typing: TypingDto) => {
      // this.isTyping.set(typing?.isTyping)
      this.isReceiverTyping.set(
        (typing!.username === this.receiverName()) &&
        typing.isTyping &&
        (typing!.receiverUsername === this.user()!.username!)

      )
    })

    this.messageService.getMessageBetween(senderReceiverDto).subscribe((messages: Message[]) => {
      this.messages.set(messages)
    })


    this.route.fragment.subscribe((frag) => {
      this.fragmentValue.set(frag)
    })
  }


  toggleMoreOption() {
    this.moreOptionShow.update((value) => !value)
  }

  sendMessage() {
    if (!this.messageForm.value.message) return

    let createMessageDto!: CreateMessageDto;

    if (this.receiverName()) {
      createMessageDto = {
        receiverUsername: this.receiverName()!,
        senderUsername: this.user()!.username!,
        text: this.messageForm.value.message
      }
    }
    else {
      createMessageDto = {
        senderUsername: this.user()!.username!,
        text: this.messageForm.value.message
      }
    }

    this.messageService.sendMessageBetween(createMessageDto).subscribe((message) => {
      this.messages.update((messages) => [...messages, message])

      this.eventsService.newMesage(message)

    })

    this.scrollToBottom()

    const typingDto: TypingDto = {
      username: this.user()!.username,
      isTyping: false,
      receiverUsername: this.receiverName()!
    }

    clearTimeout(this.typingTimeout);
    this.eventsService.typing(typingDto);

    this.messageForm.value.message = null
    this.messageForm.reset()
  }


  typingEvent(): void {
    if (!this.messageForm.value.message) return

    const typingDto: TypingDto = {
      username: this.user()!.username,
      receiverUsername: this.receiverName()!,
      isTyping: true
    }

    this.eventsService.typing(typingDto);
    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      typingDto.isTyping = false
      this.eventsService.typing(typingDto);
    }, 1000)
  }

  scrollToBottom(): void {
    try {
      let lastMessage;

      const container = this.messageContainer!.nativeElement;

      if (this.fragmentValue()) {
        lastMessage = document.getElementById(this.fragmentValue()!);;
        console.log(lastMessage)
      }
      else {
        lastMessage = container.lastElementChild;
      }

      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        lastMessage
      }

    } catch (_) {
      alert("Error")
    }
  }

  goBack() {
    this.location.back();
  }



  deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe((deletedMessage: { id: string }) => {

      this.moreOptionsClicked(id)
      this.messages.update((messages) => messages.filter((message) =>
        message.id !== deletedMessage.id
      )

      )
    })
  }



  moreOptionsClicked(id: string) {
    this.isUserInitiatedScroll = true
    this.moreOptionsClickedVal.update((val) => !val)
  }

}
