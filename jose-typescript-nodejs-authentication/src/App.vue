<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-model="drawer"
      width="220"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            row
            fluid
            v-if="item.heading"
            align-center
            :key="item.heading"
          >
            <v-flex xs>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }} 
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  <router-link :to="child.router">{{ child.text}}</router-link>    
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else  :key="item.text">
            <v-list-tile-action>
              <v-icon>{{item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content fluid>
              <v-list-tile-title>
                <router-link :to="item.router">{{ item.text}}</router-link>    
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Jose</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="this.isLoggedIn()" flat @click="login()">Log In</v-btn>
      <v-btn v-else flat @click="logOut()">Log Out</v-btn>
      <v-btn href="http://www.youse.com.br" icon huge >
        <v-avatar size="48px" tile>
          <img
            src="/static/yousemon.png"
            alt="Yousemon"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout center>
        <router-view/>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
        { icon: 'history',router: '/', text: 'Página inicial' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Guidewire',
          model: false,
          children: [          
            { text: 'Jose', router: '/jose' }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Eventos GL',
          model: false,
          children: [
            { text: 'Processar eventos contábeis' , router: '/adjustGLEvents' },
            { text: 'Histórico das Transações', router: '/historic' },
            { text: 'Log GL', router: '/logGL' }           
          ]
        }
      ]
    }),    
    methods: {
      isLoggedIn() {        
        return window.sessionStorage.accessToken == "" || window.sessionStorage.accessToken == undefined 
      },
      logOut() {
        window.sessionStorage.accessToken = ""  
        location.reload(); //Refactor      
      },
      login() {
        this.$helpers.loginUrl();
      }
    },
    props: {
      source: String
    }
  }
</script>
<style scoped>
a:link, a:visited {
    color:black;
    text-align: center;
    text-decoration: none;
}

a:hover, a:active {
  color:darkgrey;
}
</style>
