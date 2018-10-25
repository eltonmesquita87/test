<template>
  <v-layout column>
    <v-toolbar> 
      <v-btn @click.stop="openSnowdenPopUp()" icon huge >
        <v-avatar size="48px" tile>
          <img
            src="/static/jose.png"
            alt="mini"
          >
      </v-avatar>
      </v-btn>           
     <v-spacer></v-spacer>
      <v-alert type="success" dismissible v-model="alertSnowdenRan">
        Snowden was started, will disclose info on slack and database...
      </v-alert>
      <v-btn @click="reload()" icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-menu bottom right>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in menu_items" :key="i" @click="handleMenu(item.id)" >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>      
    <form>
      <v-container grid-list-md>
        <v-layout row wrap justify-center align-center>
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
        <div>
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
            <template slot="headersCell" slot-scope="jose">
              <tr>
                <v-tooltip bottom>
                  <span slot="activator">
                    {{ jose.headers.value }}
                  </span>
                  <span>
                    {{ jose.headers.value }}
                  </span>
                </v-tooltip>
              </tr>
            </template>      
            <template slot="items" slot-scope="jose">                                                        
              <tr @click="upsert(jose)"> 
                <td class="text-xs-left">
                  <v-icon v-if="jose.item.problems_found > 0" medium color="red">error</v-icon>
                </td>
                <td>{{ jose.item.id }}</td> 
                <td class="text-xs-right">{{ jose.item.started_at }}</td>        
                <td class="text-xs-right">{{ jose.item.ended_at }}</td>        
                <td class="text-xs-right">{{ jose.item.policy_number }}</td>        
                <td class="text-xs-right">{{ jose.item.environment }}</td>     
                <td class="text-xs-right">{{ jose.item.problems_found }}</td>        
              </tr>
            </template>
            <template slot="pageText" slot-scope="{ pageStart, pageStop }">
              From {{ pageStart }} to {{ pageStop }}
            </template>          
            <template v-if="jose.item.problems_found > 0" slot="expand" slot-scope="jose">
              <v-expansion-panel>
                <v-expansion-panel-content v-for="(item,i) in results.snowdenqueries" :key="i">
                  <div slot="header">
                    {{item.query_name}}
                  </div>                
                  <v-card>
                    <v-card-text v-for="(resultRow,j) in item.problems" :key="j">
                      {{resultRow.results}}
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>            
            </template>
          </v-data-table>
        </div>
      </v-container>            
      <v-dialog v-model="dialogRunSnowden" max-width="500px">
        <v-card>
          <v-card-title>
            Run Snowden?
          </v-card-title>
          <v-card-text>  
            <v-text-field
              label="Run for a Specific Policy Number?"
              single-line
              v-model="policyNumber"
          ></v-text-field>    
          <v-select
            :items="envs"
            v-model="env"
            label="Environments"
            class="input-group--focused"
            item-value="env"
            item-text="env"
          ></v-select>        
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click.stop="dialogRunSnowden=false">Close</v-btn>
            <v-btn color="primary" flat @click.stop="dialogRunSnowden=false;runSnowden()">Run!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>        
    </form>
  </v-layout>
</template>
<script>
export default {    
    data () {
      return {
        dialog: false,
        search: '',
        start_date_menu: null,
        start_date: this.formatDate(Date.now()),
        end_date_menu: null,
        end_date: null,                
        form: [],
        dialogRunSnowden: false,
        alertSnowdenRan: false,
        dialogData: null,
        pagination: {},
        policyNumber: null,
        env: null, 
        results: [],
        items: [],
        envs: [],
        pagination: {'sortBy': 'started_at', 'descending': true, 'rowsPerPage': -1}, 
        menu_items: [
                      { title: 'Reload', id: '1' },
                      { title: 'Run Snowden Now', id: '2' }  
                    ],
        headers: [
              { text: '', value : 'icon' },
              { text: 'Snowdens', sortable: true, value: 'id' },
              { text: 'Started at', value: 'started_at' },     
              { text: 'Ended at', value: 'ended_at' },     
              { text: 'Policy Number', value: 'policy_number' },   
              { text: 'Environment', value: 'environment' },     
              { text: 'Problems Found', value: 'problems_found' }    
              
          ],
      }
    },
    watch: {
        start_date(val) {
            this.getFromAPI(val, this.end_date)
        },
        end_date(val) {
          this.getFromAPI(this.start_date, val)    
        }
    },
    mounted() {       
      this.reload();
      this.getEnvs();
    },
    methods: {
        getEnvs() {
          var dataURL = this.$helpers.urlPrefix() + '/snowden/envs';
          var self = this  
          console.log(dataURL);   

          this.$helpers.connectTo(dataURL)
          .then((response) => {
            return response.json();
          }).then((data) => {
            self.envs = data; 
            self.env = data[0].env;
          })
        },
        getFromAPI(start_date, end_date) {                   
          var endDateURL = ""          
          if(end_date != undefined) {
            endDateURL = '/' + end_date             
          }          
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          var myInit = { method: 'GET',
               headers: myHeaders,
               cache: 'default' };
          var dataURL = this.$helpers.urlPrefix() + '/snowden/byRange/' + start_date + endDateURL
          var self = this  
          console.log(dataURL)
          this.$helpers.connectTo(dataURL)
          //fetch(dataURL, myInit)
          .then((response) => { 
            return response.json() })
          .then((data) => {
              self.items = data
          })          
        },
        upsert(jose){
          jose.expanded = !jose.expanded
          var dataURL = this.$helpers.urlPrefix() + '/snowden/results/' + jose.item.id
          console.log(dataURL)
          this.$helpers.connectTo(dataURL)
          .then((response) => { return response.json() })
          .then((data) => {     
              console.log(data[0].snowdenqueries);       
              this.results = data[0]
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
        },
        openSnowdenPopUp() {
          this.dialogRunSnowden = true
        },
        handleMenu(func) {
          if(func == 1) {
            this.reload()
          } else {
            this.openSnowdenPopUp()
          }
        },
        runSnowden() {
          var snowdenURL = this.$helpers.urlPrefix() + '/snowden/env/' + this.env            
          console.log(snowdenURL);
          if(this.policyNumber != undefined) {
            snowdenURL = snowdenURL + '/' + this.policyNumber             
          }  
          this.policyNumber = null
          this.openSuccess();
          this.$helpers.connectTo(snowdenURL)
          .then((response) => { 
            this.reload();            
          })  
        },
        openSuccess() {
            this.alertSnowdenRan = true
            var self = this;
            setTimeout(
              function() {
                self.alertSnowdenRan = false;               
                self.reload();
              }, 8000);
        }
    }   
}
</script>