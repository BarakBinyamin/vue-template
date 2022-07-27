<template>
    <div class="page">
        <div class="top-bar">
            <div class="status" :class="{greenStatus : configuration['connection']}"></div>
            <input  @change="initHost" v-model="options['host']"/>
            <select @change="initIndex" v-model="options['index']" class="select-index">
                <option v-for="item in options['indexes']" :value="item">{{item}}</option>  
            </select>

            <input @keydown="search" v-model="configuration['search']"/>
            <div class="right-padding"></div>
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
            response['results'].forEach(index =>{
                indexes.push(index['uid'])
            })
            indexes = response['results'].map(index => index['uid'])
            this.options['indexes'] = indexes
        },
        async clearConfigurations(){
            this.configuration = {}
            //dev
            this.configuration['feilds'] = ['id', 'poster']
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
.top-bar{
    display:grid;
    grid-template-columns: repeat(4,fit-content(100%));
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

th{
   text-align: left; 
}
input{
    margin: 5px;
    padding: 5px;
    max-width: 200px;
}
input:focus{
    outline: none;
}
table{
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text; 
  color: whitesmoke;
}
</style>