import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

export class CardCatalog extends Card{
  protected catagoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor( events: IEvents, container: HTMLElement){
    super(events, container);

    this.catagoryElement = ensureElement<HTMLElement>('.card__category', this.container);   
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);   

    this.container.addEventListener('click', ()=> {
      this.events.emit('card:open');
    })
  }

  set image(src: string){
    this.imageElement.src = src;
    //this.setImage(this.imageElement, src, alt)
  }

  set category(value: string){
    this.catagoryElement.textContent = value;
    
    const categoryClass = categoryMap[value];
    if (categoryClass) {
      this.catagoryElement.classList.add(categoryClass);
    }
  }

}