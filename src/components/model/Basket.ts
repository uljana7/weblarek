import { Item } from "../../types";
import { EventList, IEvents } from "../base/Events";


export class Basket{
  protected items: Item[];
  
  constructor(protected events: IEvents){
    this.items = [];
  }

  addItem(itemToAdd:Item):void{
    this.items.push(itemToAdd);
    this.events.emit(EventList.AddItemToCard);
  }

  deleteItem(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.events.emit(EventList.DeleteItemFromCard);

  }

  getItems():Item[]{
    return this.items;
  }

  getFullPrice():number{
    const fullPrice = this.items.reduce((sum, item) => {
      return sum + (item.price ?? 0); 
    }, 0);
    return fullPrice;
  }

  getTotalItemsCount(): number {
    return this.items.length;
  }

  isItemInBasket(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
  

}