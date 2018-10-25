<template>
   <v-layout column fluid>
      <v-toolbar>
         <v-toolbar-title>ADJUST GL SAP-GW</v-toolbar-title>
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
  import axios from 'axios'
  export default {
     data: () => ({  
         start_date_menu: null,
         end_date_menu: null,
         valid: true,
         typeEvent: null,
         alert: false,
         startdate: null,
         enddate: null,
         number: null,
         filename: '',
         logFile:'',
         items: [],
         eventsGL: [],
         customFilter(item, queryText, itemText) {
             const hasValue = val => val != null ? val : ''
             const text = hasValue(item.name)
             const query = hasValue(queryText)
             return text.toString()
                 .toLowerCase()
                 .indexOf(query.toString().toLowerCase()) > -1
         }
     }),
     created: function() {
         axios.get('http://localhost:8086/eventsGL/typesEvents')
             .then(response => {
                 this.eventsGL = response.data
             })
             .catch(e => {
                 console.log('Error:', e)
             })
     },
    methods: {
       
         submit() {
             if (this.$refs.form.validate()) {
                 let formData = {
                     typeEvent: this.typeEvent.name,
                     startdate: this.startdate,
                     enddate: this.enddate,
                     number: this.number,
                     filename: this.filename
                 };
                 console.log('formData: ', formData);
                 var self = this
                 axios.post('http://localhost:8086/eventsGL/createEventsGL', {
                         data: formData
                     })
                     .then(response => {
                         console.log('lote: ', response)
                         self.alert = true;
                     })
                     .catch(e => {
                         self.alert = false;
                         console.log('Error:', e)
                     })
             }
         },
         clear() {
             this.$refs.form.reset()
         },
         readLog(){
              var file=""
              axios.get('http://localhost:8086/eventsGL/readLogGL')
                     .then(response => {
                        console.log('Message: ', response.data)
                        console.log('objeto',Object.values(response)) 
                       
                           file=response.data
                           this.logFile=file
                        
                     }) 
                     .catch(e => {
                        console.log('Error:', e)
                     })
         }
     }
 }
</script>
