import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { Item } from "../../types";

export class Card extends Component<Item>{
  protected titleElement: HTMLHeadingElement;
  protected priceElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);  
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);   
    
    
  }

  set title(value: string){
    this.titleElement.textContent = value;
  }

  set price(value: number|null){
    if(value === null){
          this.priceElement.textContent = 'Бесценно';

    }
    else{
      this.priceElement.textContent = String(value) + ' синапсов';
    }
  }

}