<template>
  <div>
    <b-card v-for="(item, idx) in searchResult" :key="item.uuid">
      <b-media>
        <h5 class="mt-0 mb-0">
          <b-link v-bind:href="item.url">{{ item.header }}</b-link>
        </h5>
        <div>{{ item.url }}</div>
        <p class="mt-0 mb-0">{{ item.text }}</p>
        <b-media li v-for="subItem in item.sublinks" :key="subItem.uuid">
          <template v-slot:aside>-</template>

          <h5 class="mt-0 mb-0">
            <b-link v-bind:href="subItem.url">{{ subItem.header }}</b-link>
          </h5>
          {{ subItem.url }}
          <p class="mb-0" v-if="subItem.text">{{ subItem.text }}</p>
        </b-media>
      </b-media>

      <b-link class="mr-1" v-on:click="doDeleteItem(item.id, idx)"
        >Delete</b-link
      >|
      <router-link
        :to="{ name: 'localBookmark', params: { id: item.id.toString() } }"
        >Edit</router-link
      >|
      <b-badge
        variant="success"
        v-if="!item.relatedSubject"
        v-on:click="doToggleLucky(item)"
        >Feel lucky</b-badge
      >
      <b-badge
        variant
        v-if="item.relatedSubject"
        v-on:click="doToggleLucky(item)"
        >Feel lucky</b-badge
      >|
      <b-icon
        icon="heart-fill"
        variant="success"
        v-if="item.isFavorite"
        v-on:click="doToggleFavorite(item)"
      ></b-icon>
      <b-icon
        icon="heart"
        variant
        v-if="!item.isFavorite"
        v-on:click="doToggleFavorite(item)"
      ></b-icon>
      <div v-if="showTags">{{ item.tags }}</div>
    </b-card>
  </div>
</template>





<script lang="ts">
import { TLocalBookmark, LocalBookmark } from "../src/dxdb/localBookmark";

import {
  defineComponent,
  inject,
} from "@vue/composition-api";

export default defineComponent({
    props: {
    searchResult: {
      type: Array, //TLocalBookmark[]
      required: true
    },
    showTags: {
      type: Boolean,
      required: false
    }
    }
  ,
  setup(props) {
    // eslint-disable-next-line
    const router: any = inject("router");

  const doToggleLucky = (item: TLocalBookmark) => {
    item.relatedSubject = !item.relatedSubject;

    const i = new LocalBookmark(item);
    return i.save();
  }

  const doToggleFavorite = (item: TLocalBookmark)  => {
    item.isFavorite = item.isFavorite ? 0 : 1;

    const i = new LocalBookmark(item);
    return i.save();
  }

  const doDeleteItem = (itemId: number, resultIdx: number) => {
    props.searchResult.splice(resultIdx, 1);
    LocalBookmark.deleteById(itemId);
  }

  const doEditItem = (itemId: number) => {
    router.push({
      name: "localBookmark",
      params: { id: itemId.toString() }
    });
  }

  return {doToggleLucky, doToggleFavorite,
        doDeleteItem, doEditItem}
}
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>