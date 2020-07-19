<template>
  <div>
    <LocalBookmark  :id="id" />
  </div>
</template>

<script>
// @ is an alias to /src
import LocalBookmark from '@/components/LocalBookmark.vue'

export default {
  components: {
    LocalBookmark,
  },
  props: ['id']

}
</script>