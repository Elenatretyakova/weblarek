import "./scss/styles.scss";

import { Catalog } from "./components/Models/Catalog";

import { Cart } from "./components/Models/Cart";

import { Buyer } from "./components/Models/Buyer";

import { apiProducts } from "./utils/data";

import { Communication } from "./components/Models/Communication";

import { Api } from "./components/base/Api";

import { API_URL } from "./utils/constants";

const productsModel = new Catalog();

productsModel.setProducts(apiProducts.items);

console.log("Массив товаров из каталога: ", productsModel.getProducts());

console.log(
  "Товар по ID: ",
  productsModel.getProductById("412bcf81-7e75-4e70-bdb9-d3c73c9803b7"),
);

productsModel.setSelectedProduct(apiProducts.items[1]);

console.log("Выбранный товар: ", productsModel.getSelectedProduct());

const cartModel = new Cart();

cartModel.addItem(apiProducts.items[0]);

cartModel.addItem(apiProducts.items[1]);

cartModel.addItem(apiProducts.items[2]);

console.log("Список товаров в корзине: ", cartModel.getItems());

cartModel.deleteItem(apiProducts.items[2]);

console.log("Список товаров в корзине: ", cartModel.getItems());

console.log("Стоимость товаров в корзине: ", cartModel.getTotalPrice());

console.log("Количество товаров в корзине: ", cartModel.getItemsCount());

console.log(
  "Проверка товара на наличие: ",
  cartModel.checkHasItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);

cartModel.clearCart();

console.log("Список товаров в корзине: ", cartModel.getItems());

const buyerModel = new Buyer();

buyerModel.setPayment("card");

buyerModel.setAddress("Ленина,20");

buyerModel.setEmail("example@gmail.com");

buyerModel.setPhone("");

console.log("Данные покупателя: ", buyerModel.getData());

console.log("Проверка формы с данными о покупателе: ", buyerModel.checkForm());

buyerModel.clearData();

console.log("Данные покупателя: ", buyerModel.getData());

const api = new Api(API_URL);

const communication = new Communication(api);

communication
  .getProducts()
  .then((products) => {
    productsModel.setProducts(products);
    console.log("Каталог товаров:", productsModel.getProducts());
  })
  .catch((error) => {
    console.log("Ошибка получения списка товаров", error);
  });
