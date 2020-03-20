<template>
  <div id="p5-canvas-slot"></div>
</template>

<script lang='js'>
// @ is an alias to /src
import { mapState, mapMutations } from 'vuex';
import p5 from 'p5';

import pixelCanvas from '@/ts/pixel-canvas';
import { emit, emitAcked, connectedPromise } from '@/ts/socket';


export default {
  name: 'whiteboard',
  data() {
    return {
      sketch: undefined
    };
  },
  methods: {
    ...mapMutations(['setSessionName'])
  },
  mounted() {
    console.log('mounted');
    console.log('sessionName: ', this.$route.params.sessionName);
    this.setSessionName(this.$route.params.sessionName);
    connectedPromise.then(() => {
      emitAcked('joinRoomRequest', this.$route.params.sessionName)
      .then((response) => console.log(response));
      });
    this.sketch = new p5(
      pixelCanvas,
      document.querySelector('#p5-canvas-slot')
    );
  },
  beforeDestroy() {
    console.log('before destroy');
    if (this.sketch) {
      console.log('P5 sketch present. DELETING');
      this.sketch.remove();
    }
  },
  components: {}
};
</script>
