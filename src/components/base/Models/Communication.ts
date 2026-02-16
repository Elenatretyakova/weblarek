import { IApi, Data, IProduct } from "../../../types";

export class Communication {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }
  //получение списка товаров с сервера
  async getProducts(): Promise<IProduct[]> {
    const serverdata: Data = await this.api.get<Data>("/product");
    return serverdata.items;
  }
  // отпрвка данных на сервер
  async createOrder(order: Data): Promise<Data> {
    return await this.api.post<Data>("/order", order);
  }
}
