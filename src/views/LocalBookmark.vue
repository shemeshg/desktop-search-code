<template>
  <div>
    <LocalBookmark  :id="id" />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import LocalBookmark from '@/components/LocalBookmark.vue'

export default defineComponent({
  components: {
    LocalBookmark,
  },
  props: ['id']

})
</script>