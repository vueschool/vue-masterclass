<template>
  <div class="text-center" style="margin-bottom:15px;">
    <button class="btn-green btn-xsmall" @click.prevent="getRandomImage">
      Random Avatar
    </button>
    <br>
    <small style="opacity: .5">Powered by <a href="https://pixabay.com">Pixabay</a></small>
  </div>
</template>
<script>
import { arrayRandom } from '@/helpers'
export default {
  methods: {
    async getRandomImage () {
      const searchTerms = [
        'cats',
        'dogs',
        'abstract',
        'cars',
        'mountains',
        'beach',
        'landscape',
        'object',
        'food',
        'flowers',
        'architecture',
        'yellow',
        'green',
        'blue',
        'orange',
        'black',
        'white',
        'brown',
        'red',
        'patterns',
        'animal',
        'code',
        'space'
      ]
      const randomWord = arrayRandom(searchTerms)
      const res = await fetch(`https://pixabay.com/api/?key=23208036-34604012b2ea604907f4bb000&q=${randomWord}`)
      const data = await res.json()
      const randomImage = arrayRandom(data.hits)
      this.$emit('hit', randomImage.webformatURL)
    }
  }
}
</script>
