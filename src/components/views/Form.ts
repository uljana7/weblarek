import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IForm{
  errors: string;
}

export class Form extends Component<IForm>{
  protected errorElement: HTMLElement;
  protected submitButton: HTMLButtonElement;
  protected actionsElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
    this.actionsElement = ensureElement<HTMLElement>('.modal__actions', this.container)
    this.submitButton = ensureElement<HTMLButtonElement>('.button', this.actionsElement);
    
    this.submitButton.addEventListener('click', ()=> {
      this.events.emit('form:next');
    })

    
  }

  set errors(value: string){
    this.errorElement.textContent = value;
  }

}