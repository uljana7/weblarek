import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket{
  price: number;
  basketItems: HTMLElement[]
}

export class Basket extends Component<IBasket>{

  protected basket: HTMLUListElement;
  private basketButton: HTMLButtonElement;
  private priceElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basket = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

    
    this.basketButton.addEventListener('click', ()=> {
      this.events.emit('order:make');
    })
  }

  set price(value: number){
    this.priceElement.textContent = String(value) + ' синапсов';
  }
  
  set basketItems(items: HTMLElement[]) {
    this.basket.replaceChildren(...items);
  }

  buttonActivate(itemsNumber: number){
    if(itemsNumber===0){
      this.basketButton.disabled = true
    }
    else{
      this.basketButton.disabled = false
    }
  }

}