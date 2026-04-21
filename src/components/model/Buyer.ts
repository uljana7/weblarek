import { BuyerInterface, Payment } from "../../types";

export class Buyer {
  protected payment: Payment;
  protected address: string;
  protected email: string;
  protected phone: string;

  constructor( ){
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  getAllData() {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }

  saveData(data: Partial<BuyerInterface>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
  }

  validatePayment():string{
    if(!this.payment.trim()){
      return 'не выбран способ оплаты'
    }
    else{
      return ''
    }
  }

  validateAdress():string{
    if(!this.address.trim()){
      return 'не указан адрес'
    }
    else {
      return ''
    }
  }

  validateEmail():string{
    if(!this.email.trim()){
      return 'не указан эмейл';
    }
    else {
      return ''
    }
  }

  validatePhone():string{
    if(!this.phone.trim()) {
      return 'не указан номер телефона';
    }
    else{
      return ''
    }
  }

  clearFields():void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }
    
}