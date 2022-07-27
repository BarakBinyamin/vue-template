<template>
    <div class="page">
        <div class="top-bar">
            <div class="status" :class="{greenStatus : configuration['connection']}"></div>
            <input  @change="initHost" v-model="options['host']"/>
            <select @change="initIndex" v-model="options['index']" class="select-index">
                <option v-for="item in options['indexes']" :value="item">{{item}}</option>  
            </select>

            <input @keydown="search" v-model="configuration['search']"/>

            <div class="sorts-and-filters">
                <span>Sorts & Filters</span>
                <div class="dropdown-content">
                    <h3>Filter by</h3>
                    <div class="filter-sort-form">
                        <select v-model="options['filter']" class="select-index">
                            <option v-for="item in options['filterable']" :value="item">{{item}}</option>  
                        </select>
                        <select v-model="form['filterOperator']" class="select-index">
                            <option>=</option>  
                            <option>></option> 
                            <option>{{'<'}}</option> 
                        </select>
                        <select v-model="form['filterValue']" class="select-index">
                            <option v-for="item in options['filterable']" :value="item">{{item}}</option>  
                        </select>
                        <button @click="addFilter()" class="add-filter" type="submit">Add +</button>
                    </div>
                    <h3>Sort by</h3>
                    <div class="filter-sort-form">
                        <select v-model="form['sort']" class="select-index">
                            <option v-for="item in options['sortable']" :value="item">{{item}}</option>  
                        </select>
                        <select v-model="form['direction']" class="select-index">
                            <option>Ascending</option>  
                            <option>Descending</option> 
                        </select>
                        <button @click="addSort()" class="add-filter" type="submit">Add +</button>
                    </div>
                    <div class="filter-bubbles">
                        <div v-for="filter in configuration['filters']">
                            <div @click="removeSortFilter(filter)" class="filter-bubble"> 
                                <div class="name">{{filter}}</div>
                                <div class="delete">X</div>
                            </div>
                        </div>
                        <div v-for="sort in configuration['sorts']">
                            <div @click="removeSortFilter(sort)" class="filter-bubble"> 
                                <div class="name">{{sort}}</div>
                                <div class="delete">X</div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <!-- dropdown filters
                <select v-model="options['filter']" class="dropdown">
                <option v-for="item in options['filters']" :value="item">{{item}}</option>  
            </select>
            -->

        <table>
            <tr>
                <th v-for="feild in configuration['feilds']">{{feild}}</th>
            </tr>
            <tr v-for="result in results">
                <td v-for="feild in configuration['feilds']">
                    {{result[feild]}}
                </td>
            </tr>
        </table>
        <!---
        <div>
            <h1>Add Entry</h1>
            <div v-for="feild in options['rawFeilds']">
                <label :for="feild">{{feild}}</label><br>
                <input :name="feild"/>
            </div>
            <input type="submit" value="submit"/>
        </div>-->
        
    </div>
</template>

<script>
import { MeiliSearch } from 'meilisearch'

export default{
    data(){
        return{
            /* Objects, what's set */
            configuration:{
                client: "",
                index: "",
                connection: false,
                feilds:[],
                filters:[],
                sorts:[],
                search: ""
            },
            /* Strings, whats available */
            options:{
                host:"",
                indexes: [],
                attributes: [],
                filterable:[],
                filters: [],
                sortable:[]
            },
            /* Form to add filters and sorts */
            form:{
                filter: "",
                filterOperator: "",
                filterValue: "",
                sort: "",
                direction:""
            },
            results:[]
        }
    },
    methods:{
        async initHost(){
            await this.clearConfigurations("host")
            await this.clearOptions()
            try{
                const hostname               = this.options['host']
                this.configuration['client'] = new MeiliSearch({"host": hostname})
                await this.getIndexes()
                this.configuration['connection'] = true
            }
            catch(err){
                console.log("host configuration failed")
                this.configuration['connection']  = false
            }
        },
        async initIndex(){
            const client = this.configuration['client']
            if (client){
                try{
                    const indexName             = this.options['index']
                    this.configuration['index'] = client.index(indexName)
                    this.getOptions() /*update options for the index*/
                }
                catch{
                    console.log("index configuration failed")
                }
            }
            this.search()
        },
        async getIndexes(){
            const client   = this.configuration['client']
            const response = await client.getRawIndexes()
            let indexes    = []
            try{
                indexes = response['results'].map(index => index['uid'])
                this.options['indexes'] = indexes
            }catch{
                indexes = response.map(index => index['uid'])
                this.options['indexes'] = indexes
            }
        },
        async clearConfigurations(){

        },
        async getOptions(){
            /* get attributes */
            try{
                const index    = this.configuration['index']
                const results  = await index.search(
                    "",
                    {
                        filter: ["type=attribute"]
                    }
                )
                this.options['attributes']     = results['hits']
                this.configuration['feilds']   = this.options['attributes'].map(index => index['Short_Name'])
            }catch(err){
                this.options['attributes'] = []
                console.log("failed to retreive attributes")
            }
            /* get filterable and sortable attributes */
            try{
                const index    = this.configuration['index']
                this.options['filterable'] = await index.getFilterableAttributes()
                this.options['sortable']   = await index.getSortableAttributes()
            }
            catch(err){
                console.log("failed to retreive sorts and filters")
            }
        },
        addFilter(){
            const filter         = this.form['filter']
            const filterOperator = this.form['filterOperator']
            const filterValue    = this.form['filterValue']
            const filterstring   = filter + filterOperator + filterValue
            this.configuration['filters'].push(filterstring)
            this.search()
        },
        addSort(){
            const sort       = this.form['sort']
            const direction  = this.form['direction']==="Ascending" ? "asc" : "desc"
            const sortstring = sort + ":" + direction
            this.configuration['sorts'].push(sortstring)
            this.search()
        },
        removeSortFilter(item){
            this.configuration['sorts']   = this.configuration['sorts'].filter(e => e !== item);
            this.configuration['filters'] = this.configuration['filters'].filter(e => e !== item);
            this.search()
        },
        async clearOptions(){
            const hostname       = this.options['host']
            this.options         = {}
            this.options['host'] = hostname
        },
        async search(){
            try{
                const index    = this.configuration['index']
                const results  = await index.search(
                    this.configuration['search'],
                    {
                        filter: this.configuration['filters'],
                        sort: this.configuration['sorts']
                    }
                )
                this.results = results['hits']
            }catch(err){
                this.results = []
                console.log("didn't work")
            }
        }
    },
    watch: {
        /* Resets host level cookies when client is changed */
        'configuration.client' : function(value){
            
        },
        /* Resets index level cookies when client is changed */
        'configuration.client' : function(value){
            
        }

    }

}
</script>
<style>
html{
    background: white;
}
.top-bar{
    display:grid;
    grid-template-columns: repeat(5,fit-content(100%));
}
.page{
    padding: 5px;
}
.status{
    border-radius: 100%;
    display: inline-block;
    margin-top: 15px;
    background: red;
    width: 10px;
    height: 10px;
    margin-right: 10px;
}
.greenStatus{
    background: green;
}
.select-index{
    margin-top: 5px;;
    height: 30px;
    padding: 5px;
}
input{
    margin: 5px;
    padding: 5px;
    max-width: 200px;
}
input:focus{
    outline: none;
}

.sorts-and-filters {
  position: relative;
  display: inline-block;
  background: whitesmoke;
  margin: 5px;
  height: 20px;
  padding:5px;
  z-index: 100;
}

.dropdown-content {
  /*display: none;*/
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  width: max-content;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
  z-index: 1;
  left:0;
  padding-top: 10px;
  display: inline-block;
}

.filter-sort-form{
    display: grid;
    grid-template-columns: repeat(5,auto);
    grid-gap:10px;
}
.add-filter{
    height: 30px;
    padding:5px;
    margin: 5px;
    width: 50px;
}

.filter-bubbles{
    margin-top: 5px;
    display: grid;
    grid-template-columns: repeat(2,auto);
    grid-gap: 5px;
}
.filter-bubble{
    border-radius: 5px;
    padding: 5px;
    display: grid;
    grid-template-columns: repeat(2,fit-content(100%));
    background: rgba(0,0,0,.2);
    width: max-content;
}
.filter-bubble > .name{
    padding-right: 5px;
}
.filter-bubble > .delete{
    color: blue;
}
.filter-bubble > .delete:hover{
    color: red;
}


th{
   text-align: left; 
}
table{
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text; 
  color: whitesmoke;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid grey;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: rgba(52, 152, 219,.4)/*rgba(82, 124, 242,.4);*/
}
</style>