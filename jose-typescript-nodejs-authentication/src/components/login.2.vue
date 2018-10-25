<template>
  <v-layout column>  
    <form>
      <v-container grid-list-md>
        <v-layout row wrap justify-center align-center>
          <v-flex xs6 sm4>
            <v-form>
              <v-text-field required v-model="username" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
              <v-text-field required v-model="password" prepend-icon="lock" name="password" label="Password" id="password" type="password"></v-text-field>                
              <v-btn color="primary" @click="login()">Login</v-btn>
            </v-form>
          </v-flex>           
        </v-layout>
      </v-container>
    </form>
  </v-layout>
</template>
<script>
export default { 
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login() {        
        this.$helpers.login(this.username, this.password)
      }
    }
}
</script>