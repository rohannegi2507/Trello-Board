<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          <v-text-field
            class="titlebox"
            type="text"
            placeholder="Task to be done"
            v-model="cardTitle"
          />
        </v-list-item-title>
        <textarea
          class="desc"
          rows="5"
          placeholder="Please add the description here...."
        ></textarea>
      </v-list-item-content>
    </v-list-item>

    <v-container d-flex pa-2 flex-column>
      <v-btn align-self-center class="ma-2" color="error" @click="removeCard">
        Delete
        <v-icon dark> mdi-delete </v-icon>
      </v-btn>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { CardData } from "../model";

@Component
export default class Card extends Vue {
  @Prop() private cardId!: number;
  @Prop() private projectId!: number;

  cardTitleString = "Card " + this.cardId;

  created() {
    let data = localStorage.getItem("cardsData");
    if (data) {
      let cardData: any = JSON.parse(data);
      let isCardPresent = false;
      cardData.forEach((card: CardData) => {
        if (
          card.cardId == this.cardId &&
          card.parentProjectId == this.projectId
        ) {
          isCardPresent = true;
        }
      });

      cardData.push(
        new CardData({ cardId: this.cardId, parentProjectId: this.projectId })
      );
      if (!isCardPresent) {
        localStorage.setItem("cardsData", JSON.stringify(cardData));
      }
    }
  }

  get cardTitle() {
    return this.cardTitleString;
  }

  set cardTitle(newCardTitle) {
    this.cardTitleString = newCardTitle;
   
  }

  removeCard() {
    this.$emit("removeCard", this.cardId);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.desc {
  resize: none;
}
</style>
