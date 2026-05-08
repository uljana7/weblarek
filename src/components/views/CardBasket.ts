import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class CardBasket extends Card{
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor( events: IEvents, container: HTMLElement){
    super(events, container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', ()=> {
      this.events.emit('item:deleteFromCard');
    })
  }

  set index(value: number){
    this.indexElement.textContent = String(value);
  }

}