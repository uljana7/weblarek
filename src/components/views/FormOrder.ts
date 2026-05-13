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
      this.events.emit('form:paymentChoosen', button);
    }))
    this.formInput.addEventListener('change', () => {
      this.events.emit('form:input', this.formInput);
    })
    this.submitButton.addEventListener('click', ()=> {
      this.events.emit('formContact:show');
    })
  }

  activateNextButton(switcher:boolean){
    this.submitButton.disabled = !switcher;
  }



}