import { CardDetails } from "./CardDetails";
import { ICardActions } from "../../types";

//карточка товара в катологе

export class CardCatalog extends CardDetails {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
}
