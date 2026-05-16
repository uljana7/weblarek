import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery{
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery>{
  private catalogElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.catalogElement = this.container;   
  }

  set catalog(elements: HTMLElement[]){
    this.catalogElement.replaceChildren(...elements);
    this.events.emit('catalog:changed');
  }

}