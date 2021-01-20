<template>
  <div class="home">
    <Home msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import Home from '@/components/Home.vue'

export default defineComponent({
  components: {
    Home
  }
})
</script>
