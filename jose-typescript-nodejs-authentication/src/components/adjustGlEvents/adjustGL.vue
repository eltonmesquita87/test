<template>
   <v-layout column fluid>
      <v-toolbar>
         <v-toolbar-title>ADJUST GL SAP-GW</v-toolbar-title>
         -         
         <v-icon>refresh</v-icon>
      </v-toolbar>
      <div>
         <v-alert type="success" dismissible v-model="alert">
            File successfully processed
         </v-alert>
      </div>
      <br/> 
      <v-form v-model="valid" ref="form" lazy-validation>
         <v-select
            label="Event GL"
            v-model="typeEvent"
            :items="eventsGL"
            item-text="name"
            :rules="[v => !!v || 'Tipo do evento is required']"
            required
            @change="findSequence()"
            ></v-select>
         <v-menu
            ref="start_date_menu"
            lazy
            :close-on-content-click="false"
            v-model="start_date_menu"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            min-width="290px"
            :return-value.sync="startdate"
            >
            <v-text-field
               slot="activator"
               label="Start Date"
               :rules="[v => !!v || 'Start is required']" 
               required
               v-model="startdate"
               prepend-icon="event"
               readonly
               ></v-text-field>
            <v-date-picker v-model="startdate" no-title scrollable>
               <v-spacer></v-spacer>
               <v-btn flat color="primary" @click="start_date_menu = false">Cancel</v-btn>
               <v-btn flat color="primary" @click="$refs.start_date_menu.save(startdate)">OK</v-btn>
            </v-date-picker>
         </v-menu>
         <v-menu
            ref="end_date_menu"
            lazy
            :close-on-content-click="false"
            v-model="end_date_menu"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            min-width="290px"
            :return-value.sync="enddate"
            >
            <v-text-field
               slot="activator"
               label="End Date"
               :rules="[v => !!v || 'End Date is required']" 
               required
               v-model="enddate"
               prepend-icon="event"
               readonly
               ></v-text-field>
            <v-date-picker v-model="enddate" no-title scrollable>
               <v-spacer></v-spacer>
               <v-btn flat color="primary" @click="end_date_menu = false">Cancel</v-btn>
               <v-btn flat color="primary" @click="$refs.end_date_menu.save(enddate)">OK</v-btn>
            </v-date-picker>
         </v-menu>
         <v-text-field 
            label="Policy Number / Claim Number" 
            v-model="number"/>
         <v-text-field 
            label="FileName Prefix"  
            type="name"  
            disabled
            v-model="filename"/>
         <v-btn
            @click="submit"
            :disabled="!valid">
            Create File
         </v-btn>
         <v-btn @click="clear">clear</v-btn>
      </v-form>
   </v-layout>
</template>

<script>
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
         this.$helpers.connectTo(this.$helpers.urlPrefix() + '/eventsGL/typesEvents')
             .then(response => { return response.json().then(data => {
                 this.eventsGL = data
             })})
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
                 this.$helpers.connectTo(this.$helpers.urlPrefix() + '/eventsGL/createEventsGL', 'POST', formData)
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
         findSequence(){
            var self = this  
            var sequence=""
            this.$helpers.connectTo(this.$helpers.urlPrefix() + '/eventsGL/createSequenceGL')
               .then(response => response.json())
                 .then(json => {
                    sequence=JSON.stringify(json);
                    sequence=sequence.replace(/\D/g, "");
                    this.filename=sequence
                 }) 
          
         }
     }
 }
</script>
