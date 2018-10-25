<template>
   <v-layout column fluid>
      <v-toolbar>
         <v-toolbar-title>Log do Processar Eventos Contábeis</v-toolbar-title>
         -         
         <v-icon>refresh</v-icon>
      </v-toolbar>
     <br/> 
      <v-form v-model="valid" ref="form" lazy-validation>
    
      <v-text-field
          label="Log GL"
          multi-line
          readonly 
          v-model="logFile"/>
      <v-btn
          @click="readLog()"
          :disabled="!valid">
           View LOG
      </v-btn>
       
    
      </v-form>
   </v-layout>
</template>

<script>
  export default {
     data: () => ({                   
         valid: true,                                                     
         logFile:''                           
     }),
    methods: {                              
         readLog() {
            var dataURL = this.$helpers.urlPrefix() + '/eventsGL/readLogGL';
            var self = this;
            this.$helpers.connectTo(dataURL)        
            .then((response) => { 
                return response.text() })
            .then((data) => {                     
                self.logFile=data
            })                       
         }
     }
 }
</script>
