<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImg
            :src="activeUser.avatar"
            :alt="`${user.name} profile picture`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner v-if="uploadingImage" color="white" />
            <fa v-else icon="camera" size="3x" :style="{color: 'white', opacity: '.8'}" />
          </div>
          <input v-show="false" type="file" id="avatar" accept="image/*" @change="handleAvatarUpload">
        </label>
      </p>
      <UserProfileCardEditorRandomAvatar @hit="activeUser.avatar = $event" />

      <AppFormField label="Username" name="username" v-model="activeUser.username" :rules="`required|unique:users,username,${user.username}`" />
      <AppFormField label="Full Name" name="name" v-model="activeUser.name" rules="required" />
      <AppFormField label="Bio" name="bio" as="textarea" v-model="activeUser.bio" placeholder="Write a few words about yourself." />

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>
      <hr />

      <AppFormField label="Website" name="website" v-model="activeUser.website" rules="url" />
      <AppFormField label="Email" name="email" v-model="activeUser.email" :rules="`required|email|unique:users,email,${user.email}`"/>
      <AppFormField label="Location" name="location" v-model="activeUser.location" @mouseover="loadLocations" list="locations">
        <datalist id="locations">
          <option v-for="location in locationOptions" :value="location.name" :key="location.name" />
        </datalist>
      </AppFormField>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import UserProfileCardEditorRandomAvatar from './UserProfileCardEditorRandomAvatar'
export default {
  components: { UserProfileCardEditorRandomAvatar },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      locationOptions: [],
      uploadingImage: false,
      activeUser: { ...this.user }
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async handleAvatarUpload (e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar
      this.uploadingImage = false
    },
    async handleRandomAvatarUpload () {
      const randomAvatarGenerated = this.activeUser.avatar.startsWith('https://pixabay')
      if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar)
        const blob = await image.blob()
        this.activeUser.avatar = await this.uploadAvatar({ file: blob, filename: 'random' })
      }
    },
    async save () {
      await this.handleRandomAvatarUpload()
      this.$store.dispatch('users/updateUser', { ...this.activeUser })
      this.$router.push({ name: 'Profile' })
    },
    cancel () {
      this.$router.push({ name: 'Profile' })
    },
    async loadLocations () {
      if (this.locationOptions.length) return
      const res = await fetch('https://restcountries.eu/rest/v2/all')
      this.locationOptions = await res.json()
    }
  }
}
</script>
