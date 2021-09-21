<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <VeeField name="name" v-model="form.name" id="name" type="text" class="form-input" rules="required" />
          <VeeErrorMessage name="name" class="form-error" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <VeeField name="username" v-model="form.username" id="username" type="text" class="form-input" rules="required" />
          <VeeErrorMessage name="username" class="form-error" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <VeeField name="email" v-model="form.email" id="email" type="email" class="form-input"
            rules="required|email"
            />
            <VeeErrorMessage name="email" class="form-error" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <VeeField name="password" v-model="form.password" id="password" type="password" class="form-input" />
        </div>

        <div class="form-group">
          <label for="avatar">
            Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge">
            </div>
          </label>
          <VeeField
            name="avatar"
            v-show="!avatarPreview"
            id="avatar"
            type="file"
            class="form-input"
            @change="handleImageUpload"
            accept="image/*"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button @click="registerWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      avatarPreview: null,
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: ''
      }
    }
  },
  methods: {
    async register () {
      await this.$store.dispatch('auth/registerUserWithEmailAndPassword', this.form)
      this.$router.push('/')
    },
    async registerWithGoogle () {
      await this.$store.dispatch('auth/signInWithGoogle')
      this.$router.push('/')
    },
    handleImageUpload (e) {
      this.form.avatar = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        this.avatarPreview = event.target.result
      }
      reader.readAsDataURL(this.form.avatar)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>
