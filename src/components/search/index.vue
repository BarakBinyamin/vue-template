<template> 
<div  class="search-page">
    <div class="background">
        <div class="title-container">
            <div class="title">The WayBack 🚀</div>
            <div class="settings" @click="meilisearchsettings['show']=true">⚙️</div>
            <settingsModal v-model="meilisearchsettings"
            @changed="init" :toggle="meilisearchsettings['show']"/>
        </div>
        <div class="sub-title">Powered by Meilisearch</div>
    </div>
    <searchbar :id="`search`" @changed="search" 
    v-model="formVariables[`search`]"/>
    <div class="filter-results-filter-container">
        <div name="filters">
            <div class="filters">
                <div id="foo" class="filter-title">Filters</div>
                <div class="filters-container">
                    <div class="filter" v-for="item in filterable">
                        <check :id="`${item}_filter_check`" 
                        v-model="formVariables[`${item}_filter_check`]"
                        @changed="search"/>
                        <div class="filtername">{{item}}</div>
                        <dropdown :id="`${item}_filter`" 
                        v-model="formVariables[`${item}_filter`]"
                        :selection="filterableOptions[`${item}`]"
                        @changed="search"/>
                    </div>
                </div>
                <div class="filter-title">Sort by</div>
                <div class="filters-container">
                    <div class="filter" v-for="item in sortable">
                        <check :id="`${item}_sort_check`" 
                        v-model="formVariables[`${item}_sort_check`]"
                        @changed="search"
                        />
                        <div class="filtername">{{item}}</div>
                        <dropdown :id="`${item}_sort`" 
                        v-model="formVariables[`${item}_sort`]"
                        :selection="sortableOptions"
                        @changed="search"/>
                    </div>
                </div>
                <div class="filter-title">Available Feilds</div>
                <div class="feilds-container">
                    <div class="feild" v-for="item in availableFeilds">
                        <check :id="`${item}_attribute_check`" 
                        v-model="formVariables[`${item}_attribute_check`]"
                        @changed="search"/>
                        <div class="filtername">{{item}}</div>
                    </div>
                </div>
            </div>
        </div>
        <searchesTable :searchData="searchData" :selectedFeilds="selectedFeilds"/>
    </div>
</div>
</template>

<script>
import settingsModal from './settingsModal.vue'
import searchbar from './searchbar.vue'
import dropdown from './dropdown.vue'
import check from './check.vue'
import searchesTable from './searchesTable.vue'

import { MeiliSearch } from 'meilisearch'

export default {
  name: "dev",
  components: { settingsModal, searchbar, dropdown, check, searchesTable},
  data(){
    return{
        /* meilisearch setup */
        meilisearchsettings:{ 
            show: false,
            host: "",
            index:""
        },
        index: {},
        /* setup for form variables */
        filterable:[],
        filterableOptions: {},
        sortable:[],
        sortableOptions: ['ascending','descending'],
        availableFeilds:[],
        formVariables : {
        },
        /* Output of form used to search */
        sorts:[],
        filters:[],
        selectedFeilds:["id","release_date","title","poster", "overview"],
        searchString:"",
        /* output of the search */
        searchData: {}
    }
  },
  async mounted(){
    await this.init(this.meilisearchsettings['host'],this.meilisearchsettings['index'])
    await this.updateFilters()
    this.search()
  },
  methods: {
    async init(host,index){
        try{
            const client = new MeiliSearch({"host": host})
            this.index   = client.index(index)
            this.filterable        = await this.index.getFilterableAttributes()
            this.sortable          = await this.index.getSortableAttributes()
            //this.availableFeilds   = ["foo","bar","date","valuation"]
            this.filterableOptions =
            {
                "foo" : ["e", "er", "san", "su"],
                "bar" : ["u", "liu", "chi", "ba", "jo"]
            }
        }
        catch (err){
            this.filterable        = ["foo","bar"]
            this.sortable          = ["date","valuation"]
            //this.availableFeilds   = ["foo","bar","date","valuation"]
            this.filterableOptions =
            {
                "foo" : ["e", "er", "san", "su"],
                "bar" : ["u", "liu", "chi", "ba", "jo"]
            }
        }
    },
    async updateFilters(update=false){
        const form         = this.formVariables
        if (!update){
            this.filters=[]
            this.sorts=[]
            this.searchString=""
            /* Parse data from the form */
            Object.keys(form).forEach((key)=>{
                if (key==="search"){
                    this.searchString = form[key]
                }
                /* For every checked feild */
                else if(key.includes("check")){
                    if (form[key]===true){
                        /* Add it to the filters list */
                        if (key.includes("filter")){
                            const filter   = key.match(/[^_]*/)[0]
                            const selected = form[`${filter}_filter`]
                            this.filters.push(
                                `${filter} = ${selected}`
                            )
                        }
                        /* or add it to the sorts list */
                        else if (key.includes("sort")){
                            const sort     = key.match(/[^_]*/)[0]
                            let   selected = form[`${sort}_sort`]
                            if (selected.includes("asc")){
                                selected = "asc"
                            }else{
                                selected = "desc"
                            }
                            this.sorts.push(
                                `${sort}:${selected}`
                            )
                        }
                    }
                }
            })
        }

    },
    async search(){
        console.log("searching")   
        await this.updateFilters()     
        this.searchData = [...this.filters, ...this.sorts, this.searchString]
        this.searchData = {
                            "hits": [
                                {
                                "id": 2770,
                                "title": "American Pie 2",
                                "poster": "https://image.tmdb.org/t/p/w1280/q4LNgUnRfltxzp3gf1MAGiK5LhV.jpg",
                                "overview": "The whole gang are back and as close as ever. They decide to get even closer by spending the summer together at a beach house. They decide to hold the biggest",
                                "release_date": 997405200
                                },
                                {
                                "id": 190859,
                                "title": "American Sniper",
                                "poster": "https://image.tmdb.org/t/p/w1280/svPHnYE7N5NAGO49dBmRhq0vDQ3.jpg",
                                "overview": "U.S. Navy SEAL Chris Kyle takes his sole mission—protect his comrades—to heart and becomes one of the most lethal snipers in American history. His pinpoint accuracy not only saves countless lives but also makes him a prim",
                                "release_date": 1418256000
                                }
                            ],
                            "offset": 0,
                            "limit": 20,
                            "estimatedTotalHits": 976,
                            "processingTimeMs": 35,
                            "query": "american "
                            }

        /* search db 
        this.searchData  = await this.index.search(
            this.searchString,
            {
                filter: this.filters,
                sort: this.sorts
            }
        )
        /* populate searches */

    }
  }
}
</script>

<style scoped>
.background{
    margin-top:0px;
    /* background-image: url("background.jpg"); */
}
.search-page{
    top:0px;
    padding:0px;
    color: #c9d1d9;
}
.title-container{
    display: grid;
    grid-template-columns: auto auto;
}
.settings {
    padding: 5px;
    font-size: 25px;
    justify-self: right;
    padding-right: 5%;
}

.settings:hover {
    opacity: .8;
}

.title{
    margin-top:0px;
    text-align:center;
    font-size:35px;
    justify-self: right;
}
.sub-title{
    text-align:center;
    color: grey;
    font-size:18px;
}
.filter-results-filter-container{
    display: grid;
    grid-template-columns: 360px auto;
    grid-gap: 10px;
    margin-left:5px;
    margin-right:10px;
}

@media only screen and (max-width: 600px) {
    .filter-results-filter-container{
        grid-template-columns: auto;
    }
}
.filters{
    background: #161b22;
    border-radius: 5px 5px 5px 5px;
    border: 1px solid #30363d;
    width:350px;
}

.filters-container{
    padding: 10px;
    display: grid;
    width: 100%;
    align-items: center;
    justify-items: left;
    align-content: center;
    justify-content: left;
}

.filter-title{
    text-align: center;
    padding-top: 10px;
    font-size: 20px;
}

.filter{
    padding: 5px;
    display: grid;
    justify-self: center;
    grid-template-columns: auto auto auto;
    grid-gap: 10px;
}
.checkbox{
    width: 20px;
}
.filtername{
    width: 150px;
    text-overflow: ellipsis;
}
.feilds-container{
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, 150px);
    align-items: center;
    justify-items: center;
    align-content: center;
    justify-content: center;
}
.feild{
    width: 150px;
    padding: 5px;
    display: grid;
    justify-self: center;
    grid-template-columns: auto auto;
    grid-gap: 10px; 
}
</style>