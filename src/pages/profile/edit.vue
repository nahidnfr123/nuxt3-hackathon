<template>
  <Container>
    <div class="mt-12 max-w-lg m-auto">
      <h1 class="text-2xl mb-2">Edit Profile</h1>
      <client-only>
        <FormKit
            type="form"
            id="formkitForm"
            submit-label="Register"
            @submit="submitHandler"
            :actions="false"
            #default="{ value, state: { valid } }"
            #error="{error}"
            incomplete-message="Please fill in the form correctly."
        >
          <FormKit
              type="text"
              label="Full Name"
              name="name"
              placeholder="Full Name"
              validation="required|matches:/[a-zA-Z]/"
              :validation-messages="{ matches: 'Name must not include a number.' }"
              help=""
              :model-value="user.name"
          />
          <FormKit
              type="text"
              label="Email"
              name="email"
              placeholder="Email Address"
              validation="required|email"
              :model-value="user.email"
              help=""
          />
          <FormKit
              type="text"
              label="Phone"
              name="phone"
              placeholder="Phone"
              validation="starts_with:0|length:8,15|matches:/[0-9]/|"
              :model-value="user.phone"
              help=""
          />
          <AwsFileUpload
              @photoUploaded="avatarImage = $event"
              uploadPath="avatar"
              label="Avatar"
              accept=".png,.svg,.jpg,.jpeg"
          />
          <div class="inline-flex items-center justify-center w-full">
            <hr class="w-64 h-1 my-8 bg-gray-200 border-0 rounded dark:bg-gray-700">
            <div class="absolute px-2 -translate-x-1/2 bg-white left-1/2 dark:bg-white">
              Credentials
            </div>
          </div>

          <FormKit
              type="password"
              name="current_password"
              validation="?length:6"
              :validation-messages="{
              matches: 'Please include at least one symbol',
              length: 'Try to make your password longer!',
            }"
              placeholder="Current Password"
              help=""
          />
          <div class="grid grid-cols-2 gap-4">
            <FormKit
                type="password"
                name="password"
                :validation="value.current_password ? 'required|?length:6':''"
                :validation-messages="{
              matches: 'Please include at least one symbol',
              length: 'Try to make your password longer!',
            }"
                placeholder="Password"
                help="At-least 6 characters."
            />
            <FormKit
                type="password"
                name="password_confirm"
                placeholder="Confirm password"
                :validation="value.current_password ? 'required|?confirm':''"
                help=""
            />
          </div>

          <div class="mt-6">
            <FormKit
                type="submit"
                input-class="$reset w-full"
                :disabled="!valid || isLoading"
            >
              <!-- Custom Auth Button -->
              <AuthButton
                  class-name="w-full py-4 rounded-lg"
                  :disabled="!valid || isLoading"
                  :isLoading="!!isLoading"
                  text="Update"
              />
            </FormKit>
          </div>
          <!--      <pre wrap>{{ value }}</pre>-->
        </FormKit>
      </client-only>
    </div>
  </Container>
</template>

<script setup>
import {useAuthStore} from "~/stores/auth";
import AuthButton from "~/components/common/Buttons/AuthButton.vue";
import {redirectTo, throwFormError} from "~/composables/useCommon";
import Container from "~/components/common/Container.vue";
import $api from "~/composables/useRequest";
import AwsFileUpload from "~/components/Form/AwsFileUpload.vue";

definePageMeta({
  middleware: ["require-auth"]
})

const authStore = useAuthStore()
const {user} = authStore
const isLoading = ref(false)
const avatarImage = ref(null)

// Handel Registration Form Submit ...
const submitHandler = async (payload, node) => {
  if (isLoading.value) return
  node.clearErrors() // clear Previous form errors ...
  isLoading.value = true

  // Prepare data for Upload ..
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('name', payload.name || '')
  formData.append('email', payload.email || '')
  formData.append('phone', payload.phone || '')
  formData.append('avatar', avatarImage.value)
  formData.append('current_password', payload.current_password || '')
  formData.append('password', payload.password || '')
  formData.append('password_confirmation', payload.password_confirm || '')

  // Send data to Pinia Store ...
  const {data, pending, error, refresh} = await $api.post('user', formData) // call to register action in the auth store ...

  if (error.value) {
    throwFormError(error.value, node) // Show Server side errors in form ...
  } else {
    if (data?.value?.data) authStore.user = data?.value?.data // Update the User in state ...
    node.reset()
    redirectTo('/profile') /// Redirect to ?next or to given path ...
  }

  isLoading.value = false
}
</script>
