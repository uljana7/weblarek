import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess{
  count: number;
}

export class Success extends Component<ISuccess>{
  private descriptionElement: HTMLElement;
  private shoppingButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.shoppingButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    
    this.shoppingButton.addEventListener('click', ()=> {
      this.events.emit('modal:close');
    })
  }

  set count(value: number){
    this.descriptionElement.textContent = 'Списано ' + String(value) + ' синапсов';
  }

}