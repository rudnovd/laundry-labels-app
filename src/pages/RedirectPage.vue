<template>
  <q-page class="redirect-page"> {{ text }} </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    text: string
    path: string
  }>(),
  {},
)

const router = useRouter()
onMounted(() => {
  setTimeout(() => {
    router.replace(props.path)
  }, 5000)
})
</script>

<style>
.redirect-page {
  display: grid;
  place-content: center;
  place-items: center;
  font-size: 2rem;
  color: rgb(250 250 250);
  background: linear-gradient(135deg, rgb(9 121 46) 0%, rgb(75 8 129) 50%, rgb(9 121 46) 100%);
}
</style>
