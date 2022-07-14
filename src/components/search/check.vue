<template>
    <div>
        <label class="container">
            <input v-model="localValue" 
            type="checkbox"
            class="check"/>
            <span class="checkmark"></span>
        </label>
    </div>
</template>

<script>
/*
This is a check that saves its state from reload to reload
The component uses the following attributes:
id            - unique identifier, use this to find the component
modelValue    - attribute to access the selected option through v-model
@changed      - event emited when the selected is changed, this event contains the value selected

usage: <check :id="`<unique_id>`" 
v-model="`<variable>`"
/>

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
        const state           = this.$cookies.get(storageName)=== 'true'
        const defaultSelction = false
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
.check{
    width: 20px;
    margin: 0px;
    height:16px;
    outline: none;
}

.container {
  display: block;
  position: relative;
  padding-left: 15px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
