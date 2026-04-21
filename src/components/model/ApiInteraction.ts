import{IApi, ProductResponse, OrderResponse, Order} from "../../types"

export class ApiInteraction{
  protected API: IApi;

  constructor(api: IApi){
    this.API = api;
  }

  async getProducts(): Promise<ProductResponse> {
    const data = await this.API.get<ProductResponse>(`/product/`)
    return data
  }

  async postOrder(order: Order): Promise<OrderResponse>{
    const response = await this.API.post<OrderResponse>(
      `/order/`,
      order,
    )
    return response
  }
}

