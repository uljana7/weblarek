import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

interface Action{
  onClick(): void
}

export class CardBasket extends Card{
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor( events: IEvents, container: HTMLElement, onClick?: Action){
    super(events, container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if(onClick?.onClick){
      this.deleteButton.addEventListener('click', onClick.onClick)
    }
  }

  set index(value: number){
    this.indexElement.textContent = String(value);
  }

}