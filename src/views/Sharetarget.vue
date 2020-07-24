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
    //http://localhost:8080/desktop-search/sharedtarget?title=Bookmark%20Manager&text=https%3A%2F%2Fshemeshg.github.io%2Fdesktop-search%2F%23%2F
    debugger;
    this.$router.replace( {name: "localBookmark", params: { id: "-2" + encodeURIComponent(rs)}})


  }
};
</script>