<template>
  <v-container
    @dragover.prevent
    @dragenter.prevent
    @drop="onDrop($event, projectId)"
    d-flex
    pa-2
    flex-column
    flex-wrap
  >
    <v-container d-flex pa-2 flex-row justify-space-between>
      <v-text-field
        align-self-stretch
        v-if="titleSubmit === false"
        class="titlebox"
        type="text"
        @keyup.enter="titleSubmit = true"
        v-model="listTitle"
      ></v-text-field>

      <h3 v-else>{{ listTitle }}</h3>
      <button @click="removeList">
        <v-icon> mdi-close </v-icon>
      </button>
    </v-container>
    <v-card class="cards-container" d-flex pa-2 flex-column flex-wrap>
      <div
        draggable="true"
        @dragstart="startDrag($event, card.cardId, projectId)"
        class="card"
        v-for="card in cards"
        :key="card.cardId"
      >
        <Card
          :cardId="card.cardId"
          :projectId="projectId"
          @removeCard="removeCardEntry"
        ></Card>
      </div>
    </v-card>
    <v-container d-flex pa-2 flex-column>
      <v-btn
        align-self-center
        class="ma-2"
        color="secondary"
        @click="addNewCard"
      >
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "./Card.vue";

@Component({
  components: {
    Card,
  },
})
export default class List extends Vue {
  @Prop() private projectId!: number;

  titleSubmit = false;
  cards = [{ cardId: 1, parentProjectId: this.projectId }];
  listTitle = "Project " + this.projectId;

  cardIdCheck = "project" + this.projectId.toString();

  created() {
    let cardsData = localStorage.getItem("cardsData");
    if (cardsData) {
      let projectCards = JSON.parse(cardsData);
      this.cards = projectCards.filter(
        (item: { cardsId: number; parentProjectId: number }) => {
          if (this.projectId === item.parentProjectId) {
            return true;
          }
        }
      );
    }
  }

  addNewCard() {
    if (this.cards.length === 0) {
      this.cards.push({ cardId: 1, parentProjectId: this.projectId });
      return;
    }
    this.cards.push({
      cardId: this.cards[this.cards.length - 1].cardId + 1,
      parentProjectId: this.projectId,
    });
  }

  startDrag(event: any, cardId: number, projectId: number) {
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.effectAllowed = "moved";
    event.dataTransfer.setData("cardData", cardId);
  }

  onDrop(event: any, projectId: number) {
    let cardData = event.dataTransfer.getData("cardData");
    this.cards.push({ cardId: cardData, parentProjectId: this.projectId });
  }

  removeList() {
    this.$emit("removeProject", this.projectId);
  }

  removeCardEntry(id: any) {
    let removeIndex = -1;

    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].cardId === id) {
        removeIndex = i;
      }
    }

    let removedItem: { cardId: number; parentProjectId: number } | undefined =
      this.cards.splice(removeIndex, 1).pop();
    let cardsData = localStorage.getItem("cardsData");
    if (cardsData) {
      let data = JSON.parse(cardsData);
      if (data) {
        data = data.filter(
          (item: { cardId: number; parentProjectId: number }) => {
            return !(
              removedItem &&
              removedItem.cardId === item.cardId &&
              item.parentProjectId === removedItem.parentProjectId
            );
          }
        );
        localStorage.setItem("cardsData", JSON.stringify(data));
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.project-header {
  width: 250px;
  border: 3px solid black;
}

.cards-container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 600px;
  width: 300px;
}
</style>
