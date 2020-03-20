<template>
  <div id="center-container">
    <md-field id="name-input">
      <label>Namn</label>
      <md-input @input="setNamePrefix" :value="namePrefix"></md-input>
      <!-- <input type="text" /> -->
    </md-field>

    <span id="suffix">
      {{ nameSuffix ? betweenWords + nameSuffix : '' }}
    </span>
    <md-button
      @click="requestHaiku"
      id="regenerate-haiku-button"
      class="md-icon-button"
    >
      <md-icon>refresh</md-icon>
    </md-button>
    <md-button
      :disabled="namePrefix == '' || nameSuffix == '' || !sessionNameIsValid"
      @click="createBoard"
      class="md-raised md-primary"
      >Skapa whiteboard</md-button
    >
  </div>
</template>

<script>
import { emitAcked, connectedPromise } from '@/ts/socket';
import Vue from 'vue';
import { MdButton, MdField } from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import { mapMutations } from 'vuex';

Vue.use(MdButton);
Vue.use(MdField);
export default {
  name: 'BoardCreator',
  data() {
    return {
      text: 'teeeest',
      namePrefix: '',
      betweenWords: '-är-en-',
      nameSuffix: ''
    };
  },
  computed: {
    sessionName() {
      return (
        this.namePrefix.toLowerCase() + this.betweenWords + this.nameSuffix
      );
    },
    sessionNameIsValid() {
      const isValid = /^([a-zåäö]+)-är-en-([a-zåäö]+)-([a-zåäö]+)-\d$/gi.test(
        this.sessionName
      );
      // console.log('validation returned: ', isValid);
      return isValid;
    }
  },
  methods: {
    setNamePrefix(namePrefixInput) {
      this.namePrefix = namePrefixInput.toLowerCase();
    },
    createBoard() {
      console.log('creating board');

      emitAcked('createSessionRequest', this.sessionName)
        .then(response => {
          console.log('createSessionRequest responded: ', response);
          if (response) {
            this.setIsSessionOwner(true);
            // this.setSessionName(this.sessionName);
            this.$router.push({
              name: 'whiteboard',
              params: { sessionName: this.sessionName }
            });
          } else {
            requestHaiku();
          }
        })
        .catch(e => console.error(e));
    },
    requestHaiku() {
      emitAcked('haikunateRequest').then(data => {
        this.nameSuffix = data;
      });
    },
    ...mapMutations(['setIsSessionOwner', 'setSessionName'])
  },
  mounted() {
    console.log('BoardCreator mounted');
    // this.nameSuffix = '-liten-blomma-' + Math.floor(Math.random() * 11);
    connectedPromise.then(() => {
      this.requestHaiku();
    });
  }
};
</script>

<style lang="scss" scoped>
#center-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#name-input {
  width: 15rem;
}

#regenerate-haiku-button {
  margin-left: 0.3rem;
  margin-right: 2rem;
}
</style>