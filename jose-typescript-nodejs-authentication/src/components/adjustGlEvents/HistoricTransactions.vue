<template>
   <v-layout column fluid>      
        <v-app id="inspire">
          <v-toolbar>
         <!--<v-toolbar-title>Histórico de Transações GL</v-toolbar-title> -->
           <v-btn @click.stop="exportData()" icon huge >
        <v-avatar size="28px" tile>
          <img
            src="/static/microsoftexcel.png"
            alt="mini"
          >
      </v-avatar>  
       </v-btn>                
      </v-toolbar>
       <v-subheader>Filters:</v-subheader>     
     <form>
        <v-alert type="success" dismissible v-model="alert">
            Finished Data Export!
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
          <v-text-field
              append-icon="search"
              label="Search"
              single-line
              hide-details
              v-model="search"
          ></v-text-field>
          <div>
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
            <td>{{ gl.item.FileName }}</td>
            <td class="text-xs-right">{{ gl.item.LotNumber }}</td>        
            <td class="text-xs-right">{{ gl.item.CreateTime }}</td>        
            <td class="text-xs-right">{{ gl.item.EventGL }}</td>     
            <!--<td class="text-xs-right">{{ gl.item.LineNumber }}</td>   -->
            <td class="text-xs-right">{{ gl.item.TotalLotValue }}</td>        
            <td class="text-xs-right">{{ gl.item.ProcessStatus }}</td>             
            <!--<td class="text-xs-right">{{ gl.item.ErrorMessage }}</td> -->
            </tr>
        </template>
        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            From {{ pageStart }} to {{ pageStop }}
        </template>          
        </v-data-table>
           </div>
    </v-container>         
    </form>
    </v-app>
  </v-layout>
</template>
<script>
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
              { text: 'File Name', value: 'FileName', width:'10%'  },     
              { text: 'Lot Number', value: 'LotNumber' , width:'30%' },     
              { text: 'Create Time', value: 'CreateTime' , width:'10%' },     
              { text: 'Event GL', value: 'EventGL' , width:'20%' },
              //{ text: 'Line Number', value: 'LineNumber' }, 
              { text: 'Total Lot Value', value: 'TotalLotValue', width:'10%' }, 
              { text: 'ProcessStatus', value: 'Process Status', width:'10%' }, 
              //{ text: 'Error', value: 'ErrorNumber' }
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
          var endURL = ""        
          if(end_date != undefined) {
            endDateURL = '/' + end_date             
          } else {
            endDateURL = '/' + start_date 
          }
          if(eventGL != undefined) {
            endURL = '/' + eventGL           
          }          
          var dataURL = this.$helpers.urlPrefix() + '/eventsGL/byRange/' + start_date + endDateURL + endURL
          var self = this  
          console.log(dataURL)
          this.$helpers.connectTo(dataURL)
          .then((response) => { 
            return response.json() })
          .then((data) => {
              self.items = data.recordset
          })          
           return this.recordset
          
        },
        createExport(start_date, end_date,eventGL) {  
           //TODO
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
        },
        exportData(){
            var csv ='';
            var data = new Date();
            var hour = data.getHours(); 
            var min  = data.getMinutes();
            var sec  = data.getSeconds(); 
            this.getFromAPI(this.start_date, this.end_date, this.eventGL)
            const Json2csvParser = require('json2csv').Parser;
            const fields = ['FileName', 'LotNumber', 'CreateTime','EventGL','TotalLotValue','ProcessStatus'];
            const opts = {fields};
            try {
              const parser = new Json2csvParser(opts)
              csv = parser.parse(this.items)
              console.log(csv)
            } catch (err) {
              console.error(err)
            }
            var FileSaver = require('file-saver');
            var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "Export"+hour+min+sec+".csv");
       }
    }   
}
</script>