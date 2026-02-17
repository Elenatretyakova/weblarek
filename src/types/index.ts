export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
}

export type TPayment = "card" | "cash" | "";

// тип для объекта, который приложение получает с сервера

export type PoductsResponse = {
  total: number;
  items: IProduct[];
};

// тип для объекта который приложение передает на сервер

export type OrderRequest = {
  total: number;
  items: string[];
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
};

// тип ответа севреа

export type OrderResponse = {
  id: string;
  total: number;
};
