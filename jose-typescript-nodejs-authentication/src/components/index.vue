<template >
      <v-jumbotron>
        <v-container fill-height>
          <v-layout align-center>
            <v-flex text-xs-center>
              <img
                src="/static/jose.png"
                alt="jose"
              >        
            </v-flex>
          </v-layout>
        </v-container>
      </v-jumbotron>
</template>
<script>
export default { 
    methods: {
      getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
    },
    beforeMount() {
      var code = this.getParameterByName('code')
      if(code != null) {
        this.$helpers.login(code);
      } 
    }
}
</script>