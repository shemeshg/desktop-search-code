<template>
  <div>
    <b-container fluid>
      <h1>Bookmark Manager v0.6.0</h1>
      <p>search duckduckgo api</p>
      <p>redirect search of duckduckgo, google or any other search engine.</p>
      <h2>Home</h2>
      <p>Exact tag search, duckduckgo api and local bookmarks</p>
      <h2>Bookmarks</h2>
      <p>Full text search local bookmarks</p>
      <h2>Admin</h2>
      <p>Chrome extention (drag to your chrome bookmark bar)</p>
      <p>Application Configuration.</p>
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