import { item } from "../../types";

export class Catalogue{
  protected items: item[];
  protected choosenCard: item;

  constructor(itemArray: item[], card: item){
    this.items = itemArray;
    this.choosenCard = card;
  }

  public get Items(): item[] {
    return this.items;
  }

  public set ChoosenCard(itemToSave: item){
    this.choosenCard = itemToSave;
  }

  public get ChoosenCard(): item{
    return this.choosenCard;
  }

  public set Items(itemsToSave: item[]){
    this.items = itemsToSave;
  }

  public getItemById(id: string): item | null {
    const foundItem = this.items.find(item => item.id === id);
    return foundItem ?? null; 
  }
}