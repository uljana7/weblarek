import { item } from "../../types";


export class Basket{
  protected items: item[];
  
  constructor(itemArray: item[]){
    this.items = itemArray;
  }

  addItem(itemToAdd:item):void{
    this.items.push(itemToAdd);
  }

  deleteItem(itemToDelete: item):void{
    //если элемент в списке товаров - удаляем его
    if(this.items.includes(itemToDelete)){
      const index = this.items.indexOf(itemToDelete);
      this.items.splice(index, 1);
    }
  }

  public get Items():item[]{
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