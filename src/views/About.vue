<template>
  <div>
    <b-container fluid>
      <h1>Bookmark Manager v0.13.0</h1>
      <p>Search duckduckgo api</p>
      <p>Redirect search of duckduckgo, google or any other search engine.</p>  
      <pre>
        Enter - shortcut for search click
        Ctrl.Enter - shortcut for feel lucky click
        Alt.Enter - external

        Tag search - Use expretion like
          A and (b or c)
        Fulltext - use javascript regexp like
          (a | b)
          hello w.*rd
      </pre>
      <h2>Admin</h2>
      <li>Chrome extention (drag to your chrome bookmark bar)</li>
      <li>Application Configuration.</li>
      <h2>Built With</h2>
      <p>Vue</p>
      <p>Icon made by Pixel perfect from www.flaticon.com</p>    
      <h2>Authors</h2>
      <ul>
      <li><strong>shemeshg</strong></li>
      </ul>
      <h2>License</h2>
      <p>Copyright 2020 shemeshg</p>
      <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
      <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
      <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>

    </b-container>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.state.pageName = "About";
  }
};
</script>