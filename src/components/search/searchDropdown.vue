<template>
    <div>
        <select v-model="localValue" class="dropdown">
            <option v-for="item in selection" :value="item" >{{item}}</option>  
        </select>
    </div>
</template>

<script>
/*
This is a dropdown that saves its state from reload to reload
The component uses the following attributes:
id            - unique identifier, use this to find the component
modelValue    - attribute to access the selected option through v-model
selection     - list of options
@changed      - event emited when the selected is changed, this event contains the value selected

usage: <dropdown :id="`<unique_id>`" 
v-model="<variable>" 
:selection="[<selection>,<selection>]"/>

References: https://stackoverflow.com/questions/46258763/using-v-model-on-custom-component
*/
export default {
  props: ["selection", "id", "modelValue"],
  data() {
    return {
        storageName : this.id,
        localValue: ""
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    init() {
        const storageName     = this.id
        const state           = this.$cookies.get(storageName)
        const defaultSelction = this.selection[0]
        if (state){
            this.$emit("update:modelValue", state)
            this.localValue = state
        }else{
            this.$emit("update:modelValue", defaultSelction)
            this.localValue = defaultSelction
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
      selection: function(){
        console.log("selection changed")
        this.init()
      }
  }
}
</script>

<style scoped>
.dropdown{
    overflow: hidden;
    padding: 5px;
    font-size: 25px;
    border-radius: 5px;
    border: 1px solid #30363d;
    background: #0d1117;
    color: #c9d1d9;
    font-family: inherit;
}
.dropdown:focus{
    outline: none;
}
</style>
