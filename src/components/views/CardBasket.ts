import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class CardBasket extends Card{
  protected catagoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor( events: IEvents, container: HTMLElement){
    super(events, container);

    this.catagoryElement = ensureElement<HTMLElement>('.card__category', this.container);   
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);   
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', ()=> {
      this.events.emit('item:deleteFromCard');
    })
  }

  set image(src: string){
    this.imageElement.src = src;
    //this.setImage(this.imageElement, src, alt)
  }

  set category(value: string){
    this.catagoryElement.textContent = value;
  }

  set index(value: number){
    this.indexElement.textContent = String(value);
  }

}