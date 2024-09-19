<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  id: Number,
});

let news = ref([]);

onMounted(() => {
  fetch(`http://localhost:3000/get-news/${props.id}`)
    .then(response => response.json())
    .then(actus => {
      news.value = actus;
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des actualités:', error);
    });
});

const markAsRead = () => {
  fetch(`http://localhost:3000/news-read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: props.id }),
  })
    .then(response => response.json())
    .then(data => {
      document.location.href = "/"
      console.log('Actualité marquée comme lue:', data);
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour:', error);
    });
};
</script>

<template>
  <div class="news-container">
    <div class="card">
      <h1>{{ news.title }}</h1>
      <p>{{ news.content }}</p>
      
      <button v-if="!news.read" @click="markAsRead" class="read-button">
        Marquer comme lue
      </button>

      <p v-else class="read-status">Actualité déjà lue</p>
    </div>
  </div>
</template>


<style scoped>
p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}
.read-status{
  color: #45a049;
}

.read-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.read-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.read-button:hover:not(:disabled) {
  background-color: #45a049;
}
</style>
