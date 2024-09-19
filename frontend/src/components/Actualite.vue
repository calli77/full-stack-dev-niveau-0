<script setup>
defineProps({
  actualité: Object,
})
</script>

<template>
  <div>
    <div class="card">
      <h2>{{ actualité.title }}</h2>
      <RouterLink :to="{ name: 'NewsDetail', params: { id: actualité.id_actu } }">
        <button type="button">Lire</button>
      </RouterLink>
    </div>
  </div>
</template>
