<template> 
  <div  class="search-page">

    <searchbar :id="`search`" 
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
                        <div class="filtername">FilterName</div>
                        <dropdown :id="`${item}_filter`" 
                        v-model="formVariables[`${item}_filter`]"
                        :selection="['ascending','descending']"
                        @changed="search"/>
                    </div>
                </div>
                <div class="filter-title">Sort by</div>
                <div class="filters-container">
                    <div class="filter" v-for="item in filterable">
                        <check :id="`${item}_sort_check`" 
                        v-model="formVariables[`${item}_sort_check`]"
                        @changed="search"
                        />
                        <div class="filtername">FilterName</div>
                        <dropdown :id="`${item}_sort`" 
                        v-model="formVariables[`${item}_sort`]"
                        :selection="['ascending','descending']"
                        @changed="search"/>
                    </div>
                </div>
                <div class="filter-title">Available Feilds</div>
                <div class="feilds-container">
                    <div class="feild" v-for="item in filterable">
                        <check :id="`${item}_attribute_check`" 
                        v-model="formVariables[`${item}_attribute_check`]"
                        @changed="search"/>
                        <div class="filtername">FilterName</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="searches">
            {{formVariables}}
        </div>
    </div>
  </div>
</template>

<script>
import searchbar from './searchbar.vue'
import dropdown from './dropdown.vue'
import check from './check.vue'

import { MeiliSearch } from 'meilisearch'
const client = new MeiliSearch({
  host: 'http://127.0.0.1:7700',
})
const index = client.index('indexUID')

export default {
  name: "dev",
  components: { dropdown, check, searchbar},
  data(){
    return{
        filterable:["foo","bar"],
        sortable:["date","valuation"],
        availableFeilds:["foo","bar","date","valuation"],
        formVariables : {
        }
    }
  },
  mounted(){
    this.search()
  },
  methods: {
    async search(){
        console.log("searching")
        const form         = this.formVariables
        let typesearch     = ""
        let filters        = []
        let sorts          = []
        let includedFeilds = []
        /* parse data from form */
        Object.keys(form).forEach((key)=>{
            if (key==="search"){
                typesearch = form[key]
            }
            else if(key.includes("check")){
                if (form[key]===true){
                    if (key.includes("filter")){
                        const filter   = form[key].match(/[^_]*/)[0]
                        const selected = form[`${key}_filter`]
                        filters.push(
                            `${filter} = ${selected}`
                        )
                    }
                    else if (key.includes("sort")){
                        const sort     = form[key].match(/[^_]*/)[0]
                        const selected = form[`${key}_sort`]
                        if (selected.includes("asc")){
                            selected = "asc"
                        }else{
                            selected = "desc"
                        }
                        sorts.push(
                            `${sort}:${selected}`
                        )
                    }
                }
            }
        })
        /* search db */
        results = await index.search(
            typesearch,
            {
                filter: filters,
                sort: sorts
            }
        )
        /* populate searches */

    }
  }
}
</script>

<style scoped>
.search-page{
    color: #c9d1d9;
}
.filter-results-filter-container{
    display: grid;
    width: 100vw;
    grid-template-columns: 350px auto;
}

.filters{
    background: #161b22;
    border-radius: 5px 5px 5px 5px;
    border: 1px solid #30363d;
    margin-left:5px;
    margin-right:5px;
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
.searches{
    height: 600px;
    background: #161b22;
}

</style>