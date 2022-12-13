<template>
  <h1>Welcome to the Forum</h1>
  <CategoryList :categories="categories"/>
</template>

<script setup>
import CategoryList from '@/components/CategoryList'
import { useCategoriesStore } from '../stores/CategoriesStore'
import { storeToRefs } from 'pinia'
const { categories } = storeToRefs(useCategoriesStore())
</script>
