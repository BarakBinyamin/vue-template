<template>
    <div class="page">
        <div class="status" :class="{greenStatus : configuration['connection']}"></div>
        <input  @change="initHost" v-model="options['host']"/>
        <select @change="initIndex" v-model="options['index']" class="dropdown">
            <option v-for="item in options['indexes']" :value="item">{{item}}</option>  
        </select>
        <div></div>
        <!--<select v-model="options['filter']" class="dropdown">
            <option v-for="item in options['filters']" :value="item">{{item}}</option>  
        </select>-->
        <input @keydown="search" v-model="configuration['search']"/>
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
            configuration:{
                client: "",
                index: "",
                connection: false,
                feilds:[],
                filters:[],
                sorts:[],
                search: ""
            },
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
            await this.clearConfigurations()
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
        },
        async getIndexes(){
            const client   = this.configuration['client']
            const response = await client.getRawIndexes()
            let indexes    = []//await client.getIndexes()
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
html{
    color:white;
    align-items: center;
    justify-content: center;
}
.page{
    padding: 5px;
}
.status{
    border-radius: 100%;
    display: inline-block;
    background: red;
    width: 10px;
    height: 10px;
    margin-right: 10px;
}
.greenStatus{
    background: green;
}
th{
   text-align: left; 
}
input{
    margin: 5px;
    padding: 5px;
}
input:focus{
    outline: none;
}
table{
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text; 
}
</style>