<template>
  <div id="app">
    <div id="nav">
      <b-container fluid>
        <b-row >
          <b-col >
            <h5>
            <router-link to="/" ref="home">Home</router-link>|
            <router-link to="/admin" ref="admin">Admin</router-link>|
            <router-link to="/about" ref="about">About</router-link>  
                </h5>   
          </b-col>
          <b-col >
            <h5 style="color: darkcyan;font-weight: bold;">{{$store.state.pageName}}</h5>
          </b-col>
          <b-col>
            <SelectDefaultWorkbook />
          </b-col>
        </b-row>
        <hr />
      </b-container>
    </div>
    <router-view />
  </div>
</template>
<script>
import SelectDefaultWorkbook from "@/components/SelectDefaultWorkbook.vue";

export default {
  components: {
    SelectDefaultWorkbook
  }
};
</script>
<style lang="scss">
</style>
