import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { Payment } from "../../types";



export class FormOrder extends Form{
  protected paymentButtons: HTMLButtonElement[];
  protected formInput: HTMLInputElement;


  constructor(protected events: IEvents, container: HTMLElement){
    super(events, container);

    this.paymentButtons = [ensureElement<HTMLButtonElement>('.button_alt[name="card"]', this.container),ensureElement<HTMLButtonElement>('.button_alt[name="cash"]', this.container)];
    this.formInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container)
    
    this.paymentButtons.forEach(button => button.addEventListener('click', ()=> {
      this.events.emit('form:paymentChoosen', { payment: button.name });
    }))
    this.formInput.addEventListener('input', () => {
      this.events.emit('form:input', {vieldName: this.formInput.name, vieldValue: this.formInput.value});//this.formInput);
    })
    this.submitButton.addEventListener('click', ()=> {
      this.events.emit('formContact:show');
    })
  }

  activateNextButton(switcher:boolean){
    this.submitButton.disabled = !switcher;
  }

  set address(value: string){
    this.formInput.textContent = value;
  }



}