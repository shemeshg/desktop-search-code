<template>
  <div>
    <b-container fluid>
      <h1>shalom olam</h1>
  
    </b-container>
      </div>      
</template>

<script>
export default {
  mounted() {
    this.$store.state.pageName = "Sharetarget";
    const parsedUrl = new URL(window.location);
    // searchParams.get() will properly handle decoding the values.
    const title =  parsedUrl.searchParams.get('title') ? parsedUrl.searchParams.get('title') : "";
    const text =  parsedUrl.searchParams.get('text') ? parsedUrl.searchParams.get('text') : "";
    const url = parsedUrl.searchParams.get('url') ? parsedUrl.searchParams.get('url') : "";

    const r = {title: title, url: url, description: text, keywords: "", hostname: ""};

    const rs=JSON.stringify(r);
    this.$router.replace( {name: "localBookmark", params: { id: "-2" + encodeURIComponent(rs)}})


  }
};
</script>