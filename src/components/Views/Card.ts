import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IProduct, ICardActions } from "../../types";
import { categoryMap } from "../../utils/constants";
import { CDN_URL } from "../../utils/constants";

interface ICard extends IProduct {
  index?: number;
  button?: string;
}

export class Card extends Component<ICard> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>(
      `.card__title`,
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      `.card__price`,
      this.container,
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value !== null ? `${value} синапсов` : "Бесценно";
  }
}

//карточка товара в корзине

export class CardBasket extends Card {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete.card__button",
      this.container,
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set button(value: string) {
    this.buttonElement.textContent = value;
  }
}

export class CardDetails extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const className =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    this.categoryElement.className = `card__category ${className}`;
  }

  set image(value: string) {
    this.imageElement.src = CDN_URL + value;
    this.imageElement.alt = "Изображение товара";
  }
}

//карточка для детального просмора

export class CardPreview extends CardDetails {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set button(value: string) {
    this.buttonElement.textContent = value;
  }
}

//карточка товара в катологе

export class CardCatalog extends CardDetails {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
}
