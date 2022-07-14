<template>
    <div class="searches">
      <div class="th" v-for="feild in feilds">{{feild}}</div>
      <div  class="item" v-for="item in getData()">
          {{item}}
      </div>
    </div>
</template>

<script>

export default {
  props: ["searchData", "selectedFeilds"],
  data() {
    return {
      feilds: this.selectedFeilds
    }
  },
  created(){
    this.max()
  },
  methods:{
    getData(){
      let hits = []
      try{
        this.searchData['hits'].forEach(item=>{
          this.selectedFeilds.forEach(feild=>{
            hits.push(item[feild])
          })
        })
      }catch{}
      return hits 
    },
    max(){
      document.documentElement.style.setProperty('--searchesTable', 
      `auto auto auto auto auto`);
    }
  },
  watch: {
    selectedFeilds:function(value){
      this.feilds = value
    }
  }
}
</script>

<style scoped>
.searches{
    display: grid;
    grid-template-columns: var(--searchesTable);
    grid-gap: 0px;
    background: #161b22;
    width: 1000px;
    border-radius: 5px;
    padding:5px;
}

.th{
  text-align: left;
  padding: 5px;
  font-weight: bold;
  font-size: inherit;
  font-family: inherit;
}
tr{
  border-bottom:10px solid black;
}
td{
  overflow: hidden;
  width: 50px;
  height: 50px;
}
td:hover{
    opacity: .5;
}
.item{
  padding: 5px;
  font-size: inherit;
  font-family: inherit;
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 36px;
}
.item:hover{
    opacity: .5;
    max-height: none;
}
</style>
