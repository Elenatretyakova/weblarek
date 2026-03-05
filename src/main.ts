import "./scss/styles.scss";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Communication } from "./components/Models/Communication";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { CardBasket, CardCatalog, CardPreview } from "./components/Views/Card";
import { cloneTemplate } from "./utils/utils";
import { Gallery } from "./components/Views/Gallery";
import { EventEmitter } from "./components/base/Events";
import { IProduct, TPayment, OrderRequest } from "./types";
import { Modal } from "./components/Views/Modal";
import { ensureElement } from "./utils/utils";
import { Basket } from "./components/Views/Basket";
import { Header } from "./components/Views/Header";
import { FormContacts, FormPayment } from "./components/Views/Form";
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

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");

const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");

const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

const orderTemplate = ensureElement<HTMLTemplateElement>("#order");

const orderSuccessTemplate = ensureElement<HTMLTemplateElement>("#success");

const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");

//  каталог товаров;
events.on("catalog:changed", () => {
  const itemCards = productsModel.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("product:selected", item),
    });
    return card.render(item);
  });
  gallery.render({ catalog: itemCards });
});

// при нажатии на карточку товара открывается модальное окно с информацией о товаре;

events.on("product:selected", (product: IProduct) => {
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (cartModel.checkHasItem(product.id)) {
        cartModel.deleteItem(product);
      } else {
        cartModel.addItem(product);
      }
      modal.visible = false;
    },
  });
  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.category = product.category;
  cardPreview.image = product.image;
  cardPreview.description = product.description;

  // если у товара нет цены, кнопка в карточке должна быть заблокирована и иметь название «Недоступно».
  if (product.price === null) {
    cardPreview.button = "Недоступно";
  }

  // если товар находится в корзине, кнопка должна быть заменена на «Удалить из корзины»;
  else if (cartModel.checkHasItem(product.id)) {
    cardPreview.button = "Удалить из корзины";
  }

  modal.content = cardPreview.render();
  modal.visible = true;
});

//обновили счетчик
events.on("cart:changed", () => {
  const count = cartModel.getItemsCount();
  header.counter = count;
});

//закрываем модалку
events.on("modal:close", () => {
  modal.visible = false;
});

// при нажатии на иконку корзины открывается корзина;
events.on("basket:open", () => {
  const items = cartModel.getItems();

  const totalPrice = cartModel.getTotalPrice();

  // если в корзине нет товаров
  if (items.length === 0) {
    const basket = new Basket(cloneTemplate(basketTemplate));
    modal.content = basket.render();
    modal.visible = true;
    basket.buttonDisabled = true;
  } // в корзине есть товары
  else {
    const basketCards = items.map((item, index) => {
      const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
        onClick: () => {
          cartModel.deleteItem(item);
          events.emit("basket:open");
        },
      });

      cardBasket.index = index + 1;
      cardBasket.title = item.title;
      cardBasket.price = item.price;

      return cardBasket.render();
    });

    const basket = new Basket(cloneTemplate(basketTemplate), {
      onClick: () => events.emit("order:open"),
    });

    basket.title = `Корзина (${items.length})`;
    basket.price = totalPrice;
    basket.items = basketCards;
    basket.buttonDisabled = false;

    modal.content = basket.render();
    modal.visible = true;
  }
});

// открываем форму с оплатой и адресом
events.on("order:open", () => {
  buyerModel.clearData();

  const formPayment = new FormPayment(cloneTemplate(orderTemplate), {
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
  });

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
  const formContacts = new FormContacts(cloneTemplate(contactsTemplate), {
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
  });
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
  const orderSuccess = new Success(cloneTemplate(orderSuccessTemplate), {
    onClick: () => {
      cartModel.clearCart();
      buyerModel.clearData();
      events.emit("cart:changed");
      modal.visible = false;
    },
  });
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
