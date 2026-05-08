import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";



export class FormOrder extends Form{
  protected paymentButtons: HTMLButtonElement[];
  protected formInput: HTMLInputElement;


  constructor(protected events: IEvents, container: HTMLElement){
    super(events, container);

    this.paymentButtons = [ensureElement<HTMLButtonElement>('.button_alt[name="card"]', this.container),ensureElement<HTMLButtonElement>('.button_alt[name="cash"]', this.container)];
    this.formInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container)
    
    this.paymentButtons.forEach(button => button.addEventListener('click', ()=> {
      this.events.emit('form:paymentChoosen');
    }))
    this.formInput.addEventListener('change', () => {
      this.events.emit('form:input');

    })
  }



}