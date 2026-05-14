import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";



export class FormContact extends Form{
  protected formInputEmail: HTMLInputElement;
  protected formInputPhone: HTMLInputElement;



  constructor(protected events: IEvents, container: HTMLElement){
    super(events, container);

    this.formInputEmail = ensureElement<HTMLInputElement>("input[name='email']", this.container)
    this.formInputPhone = ensureElement<HTMLInputElement>("input[name='phone']", this.container)

  
    this.formInputEmail.addEventListener('change', () => {
      this.events.emit('form:input', this.formInputEmail);
    })
    this.formInputPhone.addEventListener('change', () => {
      this.events.emit('form:input', this.formInputPhone);
    })
    this.submitButton.addEventListener('click', ()=> {
      this.events.emit('order:finish');
    })
    
  }

  activateNextButton(switcher:boolean){
    this.submitButton.disabled = !switcher;
  }

}