import { ensureElement } from "../../utils/utils";
import { EventEmitter, IEvents } from "../base/Events";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

interface Action{
  onClick(): void
}

export class CardCatalog extends Card{
  protected catagoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor( events: IEvents, container: HTMLElement, onClick?: Action){
    super(events, container);

    this.catagoryElement = ensureElement<HTMLElement>('.card__category', this.container);   
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);   

    if(onClick?.onClick){
      this.container.addEventListener('click', onClick.onClick)
    }
    
  }

  set image(src: string){
    this.setImage(this.imageElement, src, this.title)
  }

  set category(value: string){
    this.catagoryElement.textContent = value;
    
    const categoryClass = categoryMap[value];
    if (categoryClass) {
      this.catagoryElement.classList.add(categoryClass);
    }
  }

}