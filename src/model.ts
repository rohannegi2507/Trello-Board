export class CardData {
  cardId: number | null = null;
  parentProjectId: number | null;

  constructor(data?: any) {
    this.cardId = typeof data.cardId !== undefined ? data.cardId : null;
    this.parentProjectId = data.parentProjectId;
  }

  CardParentProjectId(projectId: number) {
    this.parentProjectId = projectId;
  }

  CardId(cardId: number) {
    this.cardId = cardId;
  }
}
