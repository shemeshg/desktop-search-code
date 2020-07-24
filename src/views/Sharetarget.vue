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
    let text =  parsedUrl.searchParams.get('text') ? parsedUrl.searchParams.get('text') : "";
    let url = parsedUrl.searchParams.get('url') ? parsedUrl.searchParams.get('url') : "";

    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    const isTextUrl =  !!pattern.test(text);

    if ( isTextUrl && url ==="") {
      url = text;
      text = ""
    }


    const r = {title: title, url: url, description: text, keywords: "", hostname: ""};

    const rs=JSON.stringify(r);
    this.$router.replace( {name: "localBookmark", params: { id: "-2" + encodeURIComponent(rs)}})


  }
};
</script>