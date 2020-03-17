<template>
  <div class="center-container">
    <m-text-field
      v-model="namePrefix"
      outlined
      maxlength="15"
      id="my-text-field"
      aria-label="Välj unikt namn"
    >
      <m-line-ripple slot="bottomLine" />
    </m-text-field>
    <span id="suffix">
      {{ nameSuffix }}
    </span>
    <m-button raised @click="createBoard">Skapa whiteboard</m-button>
  </div>
</template>

<script lang="js">
import Button from 'material-components-vue/dist/button';
import TextField from 'material-components-vue/dist/text-field';
import Vue from 'vue';
Vue.use(Button);
Vue.use(TextField);
export default {
  name: 'BoardCreator',
  data() {
    return {
      namePrefix: '',
      nameSuffix: ''
    };
  },
  methods: {
    createBoard() {
      console.log('creating board');
    }
  },
  mounted() {
    this.nameSuffix = '-liten-blomma-' + Math.floor(Math.random() * 11);
  }
};
</script>

<style lang="scss">
.center-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
#suffix {
  margin-left: 0.3rem;
  margin-right: 2rem;
}
@import "material-components-vue/dist/button/styles";
@import "material-components-vue/dist/text-field/styles";
</style>