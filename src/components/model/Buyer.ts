import { buyer } from "../../types";

export class Buyer implements buyer{
  payment: 'card'|'cash'|'';
  address: string;
  email: string;
  phone: string;

  constructor(payment:'card'|'cash'|'', address: string, email: string, phone: string ){
    this.payment = payment;
    this.address = address;
    this.email = email;
    this.phone = phone;
  }

  getAllData() {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }

  saveData(payment: 'card'|'cash'|'', address: string, email: string, phone: string ){
    this.updateField('payment', payment )
    this.updateField('address', address )
    this.updateField('email', email)
    this.updateField('phone', phone)
  }

  updateField(fieldName: keyof buyer, value: string): void {
    
    if (fieldName === 'payment') {
      // Для payment допускаются только 'card', 'cash', ''
      if (value === 'card' || value === 'cash' || value === '') {
        this.payment = value as 'card' | 'cash' | '';
        return;
      }
    }
     else if (value.trim() === '') { //не даем записывать пустые значения в поля
        return;
      }
      else if (fieldName === 'address' ) {
      this.address = value;
    } 
    else if (fieldName === 'email') {
      this.email = value;
    } 
    else if (fieldName === 'phone') {
      this.phone = value;
    }
  }

  validatePayment():string{
    if(this.payment == ''){
      return 'не выбран способ оплаты'
    }
    else{
      return ''
    }
  }

  validateAdress():string{
    if(this.address === ''){
      return 'не указан адрес'
    }
    else {
      return ''
    }
  }

  validateEmail():string{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.email)){
      return ''
    }
    else{
      return 'некорректный эмейл'
    }
  }

  validatePhone():string{
    const phoneRegex = /^\+?\d{10,15}$/;
    if(phoneRegex.test(this.phone)){
      return ''
    }
    else{
      return 'некорректный формат номера телефона'
    }
  }

  clearFields():void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }
    
}