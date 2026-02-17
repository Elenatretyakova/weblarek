import {
  IApi,
  PoductsResponse,
  OrderRequest,
  OrderResponse,
  IProduct,
} from "../../types";

export class Communication {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }
  //получение списка товаров с сервера
  async getProducts(): Promise<IProduct[]> {
    const serverdata: PoductsResponse =
      await this.api.get<PoductsResponse>("/product");
    return serverdata.items;
  }
  // отпрвка данных на сервер
  async createOrder(data: OrderRequest): Promise<OrderResponse> {
    return await this.api.post<OrderResponse>("/order", data);
  }
}
