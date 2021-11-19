<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to my technical test
        </h1>

        <p class="subheading font-weight-regular">
          Work in progress
          <br>
          <a

            target="_blank"
          >Sodano Matéo</a>
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <p class="headline font-weight-regular">
        This site will be a portfolio site made by myself using Vue.js
        </p>

        <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <p class="headline font-weight-regular">
          Currently learning Javascript
        </p>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <p class="headline font-weight-regular">
          I will try to update this site as often as I can make changes
        </p>

        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HelloWorld',

  data: () => ({
    ecosystem: [
      {
        text: '\ntest de lien vers GitHub',
        href: 'https://github.com/teonino'
      },
      {
        text: '',
        href: ''
      },
      {
        text: '',
        href: ''
      }
    ],
    importantLinks: [
      {
        text: '',
        href: ''
      },
      {
        text: '',
        href: ''
      },
      {
        text: '',
        href: ''
      },
      {
        text: '',
        href: ''
      },
      {
        text: '',
        href: ''
      }
    ],
    whatsNext: [
      {
        text: '',
        href: ''
      },
      {
        text: '',
        href: ''
      },
      {
        text: '',
        href: ''
      }
    ]
  })
})
</script>
