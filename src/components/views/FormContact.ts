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

  
    this.formInputEmail.addEventListener('input', () => {
      this.events.emit('form:input', {vieldName: this.formInputEmail.name, vieldValue: this.formInputEmail.value});
    })
    this.formInputPhone.addEventListener('input', () => {
      this.events.emit('form:input', {vieldName: this.formInputPhone.name, vieldValue: this.formInputPhone.value});
    })
    this.submitButton.addEventListener('click', ()=> {
      this.events.emit('order:finish');
    })
    
  }

  activateNextButton(switcher:boolean){
    this.submitButton.disabled = !switcher;
  }

  set phone(value:string){
    this.formInputPhone.textContent = value;
  }

  set email(value: string){
    this.formInputEmail.textContent = value;
  }

}