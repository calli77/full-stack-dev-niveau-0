<script setup>
import { ref } from 'vue';
import Actualite from '../components/Actualite.vue';

let actualitésLu = ref([]);
let actualitésNonLu = ref([]);

fetch("http://localhost:3000/news")
  .then(response => response.json())
  .then(actus => {
    actualitésLu.value = actus.filter((actu) => actu.read);
    actualitésNonLu.value = actus.filter((actu) => !actu.read);
    console.log(actualitésNonLu.value);
    console.log(actualitésLu.value);
  });
</script>


<template>
  <h1>Les Actualités</h1>
  <h2>A lire</h2>
  <ul>
    <li v-for="actualité in actualitésNonLu" :key="actualité.id">
      <Actualite :actualité="actualité" />
    </li>
  </ul>
  <h2>Déjà lues</h2>
  <ul>
    <li v-for="actualité in actualitésLu" :key="actualité.id">
      <Actualite :actualité="actualité" />
    </li>
  </ul>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
