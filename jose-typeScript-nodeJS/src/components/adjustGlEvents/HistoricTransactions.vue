<template>
   <v-layout column fluid>      
        <v-app id="inspire">
          <v-toolbar>
         <v-toolbar-title>ADJUST GL SAP-GW</v-toolbar-title>
         -         
         <v-icon>refresh</v-icon>
      </v-toolbar>
       <v-subheader>Filters:</v-subheader>     
     <form>
        <v-alert type="success" dismissible v-model="alert">
            Finished Data Export in var/Exports Directory!
        </v-alert>
      <v-container grid-list-md>
        <v-layout row wrap justify-center
          align-center>
            <div>
             <v-flex xs8>
               <v-text-field
                  label="Event GL"
                  maxlength="4"
                  v-model="eventGL"/>
              </v-flex> 
           </div>      
          <v-flex xs6 sm4>    
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
              :return-value.sync="start_date"
            >
              <v-text-field
                slot="activator"
                label="Start Date"
                v-model="start_date"
                prepend-icon="event"
                readonly
                left
              ></v-text-field>
              <v-date-picker v-model="start_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="start_date_menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.start_date_menu.save(start_date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6 sm4>
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
              :return-value.sync="end_date"
            >
              <v-text-field
                slot="activator"
                label="End Date"
                v-model="end_date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="end_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="end_date_menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.end_date_menu.save(end_date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
        </v-flex>        
                                   
        </v-layout>
        <div align="center">
           <v-btn 
             light          
             @click="createExport(start_date, end_date, eventGL)"
             > Export Data
           </v-btn>
        </div> 
          <v-text-field
              append-icon="search"
              label="Search"
              single-line
              hide-details
              v-model="search"
          ></v-text-field>
          <v-data-table 
            v-bind:headers="headers"
            v-bind:search="search"            
            :items="items"
            v-bind:pagination.sync="pagination"
            class="elevation-1"      
          >         
        <template slot="headersCell" slot-scope="gl">
            <tr>
            <v-tooltip bottom>
                <span slot="activator">
                {{ gl.headers.value }}
                </span>
                <span>
                {{ gl.headers.value }}
                </span>
            </v-tooltip>
            </tr>
        </template>      
        <template slot="items" slot-scope="gl">                                                        
            <tr > 
            <!--td>{{ gl.item.ID }}</td> -->
            <td class="text-xs-right">{{ gl.item.FileName }}</td>
            <td class="text-xs-right">{{ gl.item.LotNumber }}</td>        
            <td class="text-xs-right">{{ gl.item.CreateTime }}</td>        
            <td class="text-xs-right">{{ gl.item.EventGL }}</td>     
            <td class="text-xs-right">{{ gl.item.LineNumber }}</td>        
            <td class="text-xs-right">{{ gl.item.TotalLotValue }}</td>        
            <td class="text-xs-right">{{ gl.item.ProcessStatus }}</td>             
            <td class="text-xs-right">{{ gl.item.ErrorMessage }}</td>        
            </tr>
        </template>
        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            From {{ pageStart }} to {{ pageStop }}
        </template>          
        </v-data-table>
      </v-container>         
    </form>
    </v-app>
  </v-layout>
</template>
<script>
import axios from 'axios'
export default {    
    data () {
      return {
        search: '',
        start_date_menu: null,
        start_date: this.formatDate(Date.now()),
        end_date_menu: null,
        end_date: null,                
        pagination: {},
        results: [],
        items: [],
        eventGL:'',
        alert: false,
        pagination: {'sortBy': 'CreateTime', 'descending': true, 'rowsPerPage': -1}, 
        headers: [
              //{ text: 'ID', sortable: true, value: 'ID' },
              { text: 'File Name', value: 'FileName' },     
              { text: 'Lot Number', value: 'LotNumber' },     
              { text: 'Create Time', value: 'CreateTime' },     
              { text: 'Event GL', value: 'EventGL' },
              { text: 'Line Number', value: 'LineNumber' }, 
              { text: 'Total Lot Value', value: 'TotalLotValue' }, 
              { text: 'ProcessStatus', value: 'Process Status' }, 
              { text: 'Error', value: 'ErrorNumber' }
          ],
      }
    },
    watch: {
        start_date(val) {
            this.getFromAPI(val, this.end_date)
        },
        end_date(val) {
          this.getFromAPI(this.start_date, val)    
        },
        eventGL(val){
           this.getFromAPI(this.start_date,this.end_date, val)    
        }
    },
    mounted() {       
      this.reload();
    },
    methods: {
        getFromAPI(start_date, end_date, eventGL) {                   
          var endDateURL = ""  
          var endURL=""        
          if(end_date != undefined) {
            endDateURL = '/' + end_date             
          }else{
             endDateURL = '/' + start_date 
          }
          if(eventGL != undefined) {
            endURL = '/' + eventGL           
          }          
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          var myInit = { method: 'GET',
               headers: myHeaders,
               cache: 'default' };
          var dataURL = 'http://localhost:8086/eventsGL/byRange/' + start_date + endDateURL + endURL
          var self = this  
          console.log(dataURL)
          console.log('GL',eventGL)
          fetch(dataURL, myInit)
          .then((response) => { 
            return response.json() })
          .then((data) => {
              self.items = data.recordset
          })          
        },
        createExport(start_date, end_date,eventGL) {  
           var endDateURL = ""           
           var file=""     
           var endURL=""    
           if(end_date != undefined) {
            endDateURL = '/' + end_date             
           }else{
             endDateURL = '/' + start_date 
          }
          if(eventGL != undefined) {
            endURL = '/' + eventGL           
          }     
           var self = this
           axios.post('http://localhost:8086/eventsGL/createExport/' + start_date + endDateURL + endURL)
            .then(response => {
                        console.log('filtro',start_date + endDateURL)
                        console.log('Message: ', response.data)
                        console.log('objeto',Object.values(response)) 
                        self.alert = true;
                        //file=response.data
                        //this.logFile=file
                     }) 
                     .catch(e => {
                        self.alert = false;
                        alert('Error:', e)
                        console.log('Error:', e)
                     }) 
		  
        },
        formatDate(date) {
          var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + d.getDate(),
              year = d.getFullYear();
          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
          return [year, month, day].join('-');
        },
        reload() {
          this.getFromAPI(this.start_date, this.end_date)  
        }
    }   
}
</script>