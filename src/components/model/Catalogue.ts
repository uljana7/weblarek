import { Item } from "../../types";
import { EventList, IEvents } from "../base/Events";

export class Catalogue{
  protected items: Item[];
  protected choosenCard: Item|null;

  constructor(protected events: IEvents){
    this.items = [];
    this.choosenCard = null;
  }

  public getItems(): Item[] {
    return this.items;
  }

  public setChoosenCard(itemToSave: Item){
    this.choosenCard = itemToSave;
    this.events.emit(EventList.OpenCard);

  }

  public getChoosenCard(): Item|null{
    return this.choosenCard;
  }

  public setItems(itemsToSave: Item[]){
    this.items = itemsToSave;
  }

  public getItemById(id: string): Item | undefined {
    const foundItem = this.items.find(item => item.id === id);
    return foundItem; 
  }
}