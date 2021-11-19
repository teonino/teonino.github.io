<template>
  <div class="about">
    <h1>{{ $t("0001") }}</h1>
    <v-btn depressed @click="changeLang()">
      Change language
    </v-btn>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default {
  name: 'About'
  /* mounted: function () {
    this.$i18n.locale = 'fr'
  },
  methods: {
    changeLang: function () {
      console.log(this.$i18n)
      if (this.$i18n.locale === 'fr') {
        this.$i18n.locale = 'en'
        console.log('en')
      } else {
        this.$i18n.locale = 'fr'
        console.log('fr')
      }
    }
  } */
}
</script>
