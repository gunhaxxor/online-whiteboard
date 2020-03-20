<template>
  <div id="container">
    <h1>Tjena skriv vilken whiteboard-session du vill ansluta till</h1>

    <div id="center-container">
      <md-field id="session-name-input">
        <label
          ><span class="variable">namn</span>-är-en-<span class="variable"
            >egenskap-sak-siffra</span
          ></label
        >
        <md-input @input="updateSessionName" :value="sessionName"> </md-input>
      </md-field>
      <md-button
        @click="connectToBoard"
        :disabled="!sessionNameIsValid"
        class="md-primary md-raised"
        >Anslut</md-button
      >
    </div>

    <router-link id="create-button" to="/skapa">
      <md-button class="md-raised">Skapa en whiteboard-session</md-button>
    </router-link>
  </div>
</template>

<script>
import Vue from 'vue';
import { MdButton, MdField } from 'vue-material/dist/components';
import { emitAcked } from '../ts/socket';
Vue.use(MdButton);
Vue.use(MdField);

export default {
  data() {
    return {
      sessionName: ''
    };
  },
  computed: {
    sessionNameIsValid() {
      const isValid = /^([a-zåäö]+)-är-en-([a-zåäö]+)-([a-zåäö]+)-\d$/gi.test(
        this.sessionName
      );
      // console.log('validation returned: ', isValid);
      return isValid;
    }
  },
  methods: {
    updateSessionName(inputText) {
      console.log('update sessionName ', inputText);
      const transformedText = inputText.replace(' ', '-');
      this.sessionName = transformedText;
    },
    connectToBoard() {
      emitAcked('joinRoomRequest', this.sessionName).then(response => {
        if (response) {
          this.$router.push(this.sessionName);
        }
      });
    }
  }
};
</script>

<style>
#container {
  width: 100vw;
  height: 100vh;
  padding: 2rem;
}

#center-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

#session-name-input {
  width: 25rem;
}

#create-button {
  position: absolute;
  right: 3rem;
  bottom: 3rem;
}

.variable {
  color: primary;
}
</style>