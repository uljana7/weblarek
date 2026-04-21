export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type Payment = 'card'|'cash'|'';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface Item{
  id: string,
  title: string,
  image: string,
  category: string,
  price: number|null,
  description: string
  
};

export interface BuyerInterface{
  payment: Payment,
  address: string,
  email: string,
  phone: string
}

export interface Order extends BuyerInterface{
  total: number,
  items: Item[]
}

export interface OrderResponse {
  id: string
  total: number
}

export interface ProductResponse {
  total: number
  items: Item[]
}

