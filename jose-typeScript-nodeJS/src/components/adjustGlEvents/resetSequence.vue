<template>
   <v-layout column fluid>
      <v-toolbar>
         <v-toolbar-title>ADJUST GL SAP-GW</v-toolbar-title>
         -         
         <v-icon>refresh</v-icon>
      </v-toolbar>
     <br/> 
      <v-form>
         <v-alert type="success" dismissible v-model="alert">
            Sequence Restarted!
        </v-alert>    
      <div align="center">
       <v-btn
           @click="resetSequence()">
           Reset Sequence
       </v-btn>
      </div> 
    </v-form>
   </v-layout>
</template>

<script>
  import axios from 'axios'
  export default {
     data: () => ({  
         alert: false,
     }),
     methods: {
         resetSequence(){
              var self = this
              axios.get('http://localhost:8086/eventsGL/resetSequence')
                     .then(response => {
                        console.log('Message: ', response.data)
                        self.alert = true;
                     }) 
                     .catch(e => {
                        console.log('Error:', e)
                     })
         }
     }
 }
</script>
