import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess{
  count: number;
}

export class Success extends Component<ISuccess>{
  private descriptionElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    
  }

  set count(value: number){
    this.descriptionElement.textContent = 'Списано ' + String(value) + ' синапсов';
  }

}