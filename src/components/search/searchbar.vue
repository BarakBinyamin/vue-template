<template>
    <div>
        <div class="searchbar-container">
            <input v-model="localValue" class="searchbar"  
            placeholder="search"/>
        </div>
    </div>
</template>

<script>
/*
This is a searchbar that saves its state from reload to reload
The component uses the following attributes:
id            - unique identifier, use this to find the component
modelValue    - attribute to access the selected option through v-model
@changed      - event emited when the selected is changed, this event contains the value selected

usage: <searchbar :id="`<unique_id>`" 
v-model="`<variable>`"/>

References: https://stackoverflow.com/questions/46258763/using-v-model-on-custom-component
*/
export default {
  props: ["id", "modelValue"],
  data() {
    return {
        storageName : this.id,
        localValue: this.init()
    }
  },
  methods:{
    init() {
        const storageName     = this.id
        const state           = this.$cookies.get(storageName)
        const defaultSelction = ""
        if (state){
            this.$emit("update:modelValue", state)
            return state
        }else{
            this.$emit("update:modelValue", defaultSelction)
            return defaultSelction
        }
    }
  },
   watch: {
      localValue: function () {
        //console.log(`changed ${this.storageName}`)
        this.$emit("update:modelValue", this.localValue) 
        this.$emit("changed", this.localValue)
        this.$cookies.set(this.storageName, this.localValue)
      },
  }
}
</script>

<style scoped>
.searchbar-container{
    display: grid;
    justify-items: center;
    justify-content: center;
    margin: 10px;
}
.searchbar{
    width: 500px;
    padding: 5px;
    font-size: 25px;
    border-radius: 5px;
    border: 1px solid #30363d;
    background: #0d1117;
    color: #c9d1d9;
    font-family: inherit;
    box-shadow: 0px 1px 5px 1px rgba(255,255,255,.2);
}
.searchbar:focus{
    outline: none;
}
</style>
