import { IApi, OrederResponse, IProduct } from "../../types";

export class Communication {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }
  //получение списка товаров с сервера
  async getProducts(): Promise<IProduct[]> {
    const serverdata: OrederResponse = await this.api.get<OrederResponse>("/product");
    return serverdata.items;
  }
  // отпрвка данных на сервер
  async createOrder(order: OrederResponse): Promise<{id: string; total: number}> {
    return await this.api.post<{id: string; total: number}>("/order", order);
  }
}
