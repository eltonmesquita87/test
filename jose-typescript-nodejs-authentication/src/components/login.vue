<template>
  <v-layout column>  
    <form>
      <v-container grid-list-md>
        <v-layout row wrap justify-center align-center>
          <v-flex xs6 sm4>
            <v-form>
              <v-subheader>Invalid Session! Please Log in!</v-subheader>              
              <v-btn color="primary" @click="login()">Login with google!</v-btn>
            </v-form>
          </v-flex>           
        </v-layout>
      </v-container>
    </form>
  </v-layout>
</template>
<script>
export default { 
    methods: {
      login() {        
        this.$helpers.loginUrl();
      }
    }
}
</script>