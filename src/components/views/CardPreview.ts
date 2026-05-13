import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

export class CardPreview extends Card{
  protected catagoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor( events: IEvents, container: HTMLElement){
    super(events, container);

    this.catagoryElement = ensureElement<HTMLElement>('.card__category', this.container);   
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);   
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);


    this.cardButton.addEventListener('click', ()=> {
      this.events.emit('item:addToCard');
    })
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

  set description(value: string){
    this.descriptionElement.textContent = value;
  }

  activateBuyButton(added: boolean){
    if(this.priceElement.textContent === 'Бесценно'){//проверка на бесценность
      this.cardButton.textContent = 'Недоступно';
      this.cardButton.disabled = true;
    }
    else{
      this.cardButton.textContent = 'Купить';
      this.cardButton.disabled = false;
    }

    if(added){//проверка на нахождение в корзине
      this.cardButton.textContent = 'Удалить из корзины'
    }
    else{
      this.cardButton.textContent = 'Купить';
    }
  }
}