<template>
    <div>
        <div class="textbar-container">
            <div class="label">{{label}}</div>
            <input @keyup.enter="changed" v-model="localValue" class="textbar"  
            :placeholder="placeholder"/>
        </div>
        <div class="progress-container">
            <div :class="{progress:show}"></div>
        </div>
    </div>
</template>

<script>
/*
This is a textbar that saves its state from reload to reload
The component uses the following attributes:
id            - unique identifier, use this to find the component
modelValue    - attribute to access the selected option through v-model
@changed      - event emited when the selected is changed, this event contains the value selected

usage: <textbar :id="`<unique_id>`" 
v-model="`<variable>`"/>

References: https://stackoverflow.com/questions/46258763/using-v-model-on-custom-component
*/
export default {
  props: ["id", "label", "placeholder", "modelValue"],
  data() {
    return {
        storageName : this.id,
        localValue: this.init(),
        show: false
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
    },
    changed(){
        this.$emit("changed", this.localValue)
        this.show = true
    }
  },
   watch: {
      localValue: function () {
        //console.log(`changed ${this.storageName}`)
        this.$emit("update:modelValue", this.localValue) 
        this.$cookies.set(this.storageName, this.localValue)
      },
  }
}
</script>

<style scoped>
.label{
    color:black;
    padding:0px 0px 5px  35px;
    justify-items: left;
}
.textbar-container{
    display: grid;
    margin: 10px;
    height: 15px;
}

.textbar{
    justify-self: center;
    width: 200px;
    height: 20px;
    padding: 5px;
    margin: 0;
}

.textbar:focus{
    outline: none;
}

.progress-container{
    display: grid;
}

.progress{
    display: block;
    padding: 6px;
    width: 200px;
    height: 20px;
    margin-left: 44px;
    justify-self: left;
    opacity: 1;
    background: rgba(0, 128, 0, .4);
    animation-name: progress;
    animation-duration: 1s;
    pointer-events: none;
}

@keyframes progress {
  from { width: 0%;   }
  to   { width: 200px; }
} 
</style>
