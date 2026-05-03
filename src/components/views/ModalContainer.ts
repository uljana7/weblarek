import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal{
  content: HTMLElement;
}

export class ModalContainer extends Component<IModal>{
  private closeButton: HTMLButtonElement;
  private contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container)

    this.closeButton.addEventListener('click', ()=> {
      this.events.emit('modal:close');
    })
  }

  set content(value: HTMLElement){
    this.contentElement.replaceChildren(value);
  }

}