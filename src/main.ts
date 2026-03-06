import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Communication } from "./components/Models/Communication";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { CardBasket } from "./components/Views/CardBasket";
import { CardCatalog } from "./components/Views/CardCatalog";
import { CardPreview } from "./components/Views/CardPreview";
import { cloneTemplate } from "./utils/utils";
import { Gallery } from "./components/Views/Gallery";
import { EventEmitter } from "./components/base/Events";
import { IProduct, TPayment, OrderRequest } from "./types";
import { Modal } from "./components/Views/Modal";
import { ensureElement } from "./utils/utils";
import { Basket } from "./components/Views/Basket";
import { Header } from "./components/Views/Header";
import { FormContacts } from "./components/Views/FormContacts";
import { FormPayment } from "./components/Views/FormPayment";
import { Success } from "./components/Views/Success";

const api = new Api(API_URL);

const communication = new Communication(api);

const events = new EventEmitter();

const productsModel = new Catalog(events);

const cartModel = new Cart(events);

const buyerModel = new Buyer(events);

const gallery = new Gallery(ensureElement<HTMLElement>("body"));

const modal = new Modal(ensureElement<HTMLElement>(".modal"), events);

const header = new Header(ensureElement<HTMLElement>(".header"), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

// экземпляр карточки ждя подробного отображения
const cardPreview = new CardPreview(
  cloneTemplate(ensureElement<HTMLTemplateElement>("#card-preview")),
  {
    onClick: () => events.emit("product:buy"),
  },
);

const basket = new Basket(
  cloneTemplate(ensureElement<HTMLTemplateElement>("#basket")),
  {
    onClick: () => events.emit("order:open"),
  },
);

const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

// для формы оплаты с адресом и способом оплаты
const formPayment = new FormPayment(
  cloneTemplate(ensureElement<HTMLTemplateElement>("#order")),
  {
    onPaymentSelect: (payment: TPayment) => {
      buyerModel.setPayment(payment);
      formPayment.payment = payment;
      validateFormPayment(formPayment);
    },
    onAddressInput: (address: string) => {
      buyerModel.setAddress(address);
      validateFormPayment(formPayment);
    },
    onSubmit: () => {
      events.emit("order:contacts");
    },
  },
);

// для формы оплаты с почтой и телефоном
const formContacts = new FormContacts(
  cloneTemplate(ensureElement<HTMLTemplateElement>("#contacts")),
  {
    onEmailInput: (email: string) => {
      buyerModel.setEmail(email);
      validateFormContacts(formContacts);
    },
    onPhoneInput: (phone: string) => {
      buyerModel.setPhone(phone);
      validateFormContacts(formContacts);
    },
    onSubmit: async () => {
      const totalPrice = cartModel.getTotalPrice();
      const items = cartModel.getItems();
      const orderData: OrderRequest = {
        total: totalPrice,
        items: items.map((item) => item.id),
        ...buyerModel.getData(),
      };

      try {
        await communication.createOrder(orderData);
      } catch (error) {
        console.error("Ошибка оформления заказа:", error);
      }

      events.emit("order:success", { total: totalPrice });
    },
  },
);

// экземпляр окна подтверждения
const orderSuccess = new Success(
  cloneTemplate(ensureElement<HTMLTemplateElement>("#success")),
  {
    onClick: () => {
      events.emit("cart:changed");
      modal.visible = false;
    },
  },
);

//  каталог товаров;
events.on("catalog:changed", () => {
  const itemCards = productsModel.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render(item);
  });
  gallery.render({ catalog: itemCards });
});

// при нажатии на карточку товара открывается модальное окно с информацией о товаре;
events.on("card:select", (product: IProduct) => {
  productsModel.setSelectedProduct(product);

  productsModel.getSelectedProduct();

  let buttonText = "Купить";

  if (product.price === null) {
    buttonText = "Недоступно";
    cardPreview.buttonDisabled = true;
  } else if (cartModel.checkHasItem(product.id)) {
    buttonText = "Удалить из корзины";
  }
  cardPreview.button = buttonText;

  const objForRender = {
    ...product,
    button: buttonText,
    buttonDisabled: product.price === null,
  };

  modal.content = cardPreview.render(objForRender);

  modal.visible = true;
});

// при клике на кнопку "купить" проверяем есть ли товра в корзине
events.on("product:buy", () => {
  const product = productsModel.getSelectedProduct();
  if (!product) return;

  if (cartModel.checkHasItem(product.id)) {
    cartModel.deleteItem(product);
  } else {
    cartModel.addItem(product);
  }
  modal.visible = false;
});

// открывваем корзину
events.on("basket:open", () => {
  modal.content = basket.render();
  modal.visible = true;
});

// если данные корзины изменились, то обновляем данные рендерим товары в корзине
events.on("cart:changed", () => {
  const items = cartModel.getItems();

  const totalPrice = cartModel.getTotalPrice();

  header.counter = cartModel.getItemsCount();

  const basketCards = items.map((item, index) => {
    const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit("item:delete", item),
    });

    cardBasket.index = index + 1;
    cardBasket.title = item.title;
    cardBasket.price = item.price;
    return cardBasket.render();
  });

  basket.title = `Корзина (${items.length})`;
  basket.price = totalPrice;
  basket.items = basketCards;
  basket.buttonDisabled = items.length === 0;
  modal.content = basket.render();
});

// удаляем товар при нажатии кнопки удаления к корзине
events.on("item:delete", (product: IProduct) => {
  cartModel.deleteItem(product);
});

// открываем форму с оплатой и адресом
events.on("order:open", () => {
  buyerModel.clearData();

  formPayment.address = "";
  formPayment.payment = "";
  formPayment.errors = "";
  formPayment.submitDisabled = true;

  modal.content = formPayment.render();
  modal.visible = true;
});

// проверка на пустые поля
function validateFormPayment(form: FormPayment) {
  const { errors } = buyerModel.checkForm();

  if (errors.payment) {
    form.errors = errors.payment;
    form.submitDisabled = true;
  } else if (errors.address) {
    form.errors = errors.address;
    form.submitDisabled = true;
  } else {
    form.errors = "";
    form.submitDisabled = false;
  }
}
// открываем  форму с почтой и телефоном
events.on("order:contacts", () => {
  formContacts.email = "";
  formContacts.phone = "";
  formContacts.errors = "";
  formContacts.submitDisabled = true;

  modal.content = formContacts.render();
  modal.visible = true;
});

// проверка на пустые поля
function validateFormContacts(form: FormContacts) {
  const { errors } = buyerModel.checkForm();

  if (errors.email) {
    form.errors = errors.email;
    form.submitDisabled = true;
  } else if (errors.phone) {
    form.errors = errors.phone;
    form.submitDisabled = true;
  } else {
    form.errors = "";
    form.submitDisabled = false;
  }
}
// завершение заказа
events.on("order:success", (data: { total: number }) => {
  cartModel.clearCart();
  buyerModel.clearData();

  orderSuccess.description = data.total;
  modal.content = orderSuccess.render();
});

communication
  .getProducts()
  .then((products) => {
    productsModel.setProducts(products);
    console.log("Каталог товаров:", productsModel.getProducts());
  })
  .catch((error) => {
    console.log("Ошибка получения списка товаров", error);
  });
