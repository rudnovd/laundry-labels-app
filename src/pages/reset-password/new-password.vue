<template>
  <UpdatePasswordDialog back-path="/" />
</template>

<script setup lang="ts">
import UpdatePasswordDialog from '@/components/dialogues/UpdatePasswordDialog.vue'
</script>

<style>
.profile-options-locale-page {
  .base-dialog__content {
    display: grid;
    gap: 1rem;
    .locale-settings-item {
      flex-direction: column;
    }
  }
}
</style>
