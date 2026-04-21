import { Item } from "../../types";

export class Catalogue{
  protected items: Item[];
  protected choosenCard: Item|null;

  constructor(){
    this.items = [];
    this.choosenCard = null;
  }

  public getItems(): Item[] {
    return this.items;
  }

  public setChoosenCard(itemToSave: Item){
    this.choosenCard = itemToSave;
  }

  public getChoosenCard(): Item|null{
    return this.choosenCard;
  }

  public setItems(itemsToSave: Item[]){
    this.items = itemsToSave;
  }

  public getItemById(id: string): Item | undefined {
    const foundItem = this.items.find(item => item.id === id);
    return foundItem ?? undefined; 
  }
}