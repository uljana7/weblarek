import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";



export class FormOrder extends Form{
  protected paymentButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(events, container);

    this.paymentButton = ensureElement<HTMLButtonElement>('.button_alt', this.container);

    
    this.paymentButton.addEventListener('click', ()=> {
      this.events.emit('form:paymentChoosen');
    })
  }



}