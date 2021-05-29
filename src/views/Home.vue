<template>
  <v-container class="d-flex pa-2 flex-column align-center" outlined tile>
    <h1>Trello Board</h1>
    <v-btn color="primary" @click="addNewList"> Add List </v-btn>
    <v-container
      class="project-container"
      d-lg-flex
      pa-2
      flex-row
      justify-flex-start
    >
      <v-card
        max-width="344"
        d-flex
        pa-2
        flex-row
        justify-flex-start
        v-for="project in projectList"
        :key="project.projectId"
        ><List
          class="project"
          :projectId="project.projectId"
          @removeProject="removeProjectItem"
        />
      </v-card>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import List from "../components/List.vue";

@Component({
  components: {
    List,
  },
})
export default class Home extends Vue {
  projectList = [{ projectId: 1 }];

  created() {
    let projectList = localStorage.getItem("projectList");
    if (!projectList) {
      localStorage.setItem("projectList", JSON.stringify(this.projectList));
    } else {
      this.projectList = JSON.parse(projectList);
    }

    if (!localStorage.getItem("cardsData")) {
      localStorage.setItem("cardsData", JSON.stringify([]));
    }
  }

  addNewList() {
    if (this.projectList.length === 0) {
      this.projectList.push({ projectId: 1 });
      return;
    }
    this.projectList.push({
      projectId: this.projectList[this.projectList.length - 1].projectId + 1,
    });
    localStorage.setItem("projectList", JSON.stringify(this.projectList));
  }

  removeProjectItem(id: any) {
    let removeIndex = -1;
    for (let i = 0; i < this.projectList.length; i++) {
      if (this.projectList[i].projectId === id) {
        removeIndex = i;
      }
    }

    this.projectList.splice(removeIndex, 1);
    localStorage.setItem("projectList", JSON.stringify(this.projectList));
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 3rem;
}

.project {
  margin: 0.5rem;
}
.project-container {
  overflow: auto;
}
</style>
>
