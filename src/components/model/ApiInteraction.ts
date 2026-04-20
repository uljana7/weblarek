import{IApi, ProductResponse, OrderResponse, buyer} from "../../types"

export class ApiInteraction{
  protected API: IApi;

  constructor(api: IApi){
    this.API = api;
  }

  async getProducts(): Promise<ProductResponse> {
    const data = await this.API.get<ProductResponse>(`/product/`)
    return data
  }

  async postOrder(order: buyer): Promise<OrderResponse>{
    const response = await this.API.post<OrderResponse>(
      `/order/`,
      order,
      'POST',
    )
    return response
  }
}

