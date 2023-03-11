<template>
  <FormKit
      v-if="!complete"
      type="form"
      id="awsForm"
      submit-label="Register"
      @submit="submitHandler"
      :actions="false"
      #default="{ value, state: { valid } }"
      #error="{error}"
      incomplete-message="Please fill in the form correctly."
  >
    <div class="flex gap-4 justify-start align-bottom items-end">
      <div class="flex-1">
        <FormKit
            type="file"
            label="File Uploader"
            name="avatar"
            help=""
            accept=".jpg,.png,.pdf"
            validation="required"
            :model-value="images"
        />
      </div>
      <div class="mt-2">
        <FormKit
            ref="uploadButton"
            classes="rounden-lg"
            type="submit"
            input-class="w-full"
            :disabled="!valid || loading"
        >
          {{ loading ? 'Uploading...' : 'Submit' }}
        </FormKit>
      </div>
    </div>
  </FormKit>
  <div v-else class="complete">File Upload Complete. 👍</div>
</template>

<script setup>
import $api from "~/composables/useRequest";

const complete = ref(false)
const uploadButton = ref(null)
let loading = ref(false)
let images = ref([])
let uploadPercentage = ref(0)
let downloadPercentage = ref(0)
let uploadedPhoto = ref([])
const emit = defineEmits(['photoUploaded'])

const props = defineProps({
  uploadPath: {type: String, default: '/image'},
  multiple: {type: Boolean, default: false}
})

watch(uploadedPhoto, async (newVal, oldVal) => {
  if (newVal) emit('photoUploaded', uploadedPhoto.value)
})

// watchEffect(images, async (newVal, oldVal) => {
//   if (newVal) {
//      uploadButton.click()
//     console.log(newVal)
//   }
// })

// watchEffect(uploadedPhoto, (value, oldVal) => {
//   console.log(value)
//   emit('photoUploaded', uploadedPhoto.value)
// });

const submitHandler = async (data) => {
  const body = new FormData()
  data.avatar.forEach((fileItem) => {
    upload(fileItem?.file)
  })
}

const upload = async (file) => {
  loading.value = true
  const formData = new FormData()
  const extension = file.name.split('.').pop()

  formData.append('name', props.uploadPath + '/' + randomString(32) + '.' + extension)

  const url = 'aws-url'
  let signedUrl = ''

  const options = {showSuccess: true, showError: true, successMessage: 'Registered Successfully!'}
  const {data, pending, error, refresh} = await $api.post(url, formData, options) // Register Request to api ...

  signedUrl = data?.value?.url
  const resp = await uploadFile(signedUrl, file)

  if (props.multiple) {
    uploadedPhoto.push(resp ? signedUrl : null)
  } else uploadedPhoto = resp ? signedUrl : null

  emit('photoUploaded', uploadedPhoto)
  loading.value = false
}

const uploadFile = async (url, file = file) => {
  const xhr = new XMLHttpRequest()

  return await new Promise((resolve) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable)
        uploadPercentage = parseInt(Math.round((event.loaded / event.total) * 100))
    })
    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable)
        downloadPercentage = parseInt(Math.round((event.loaded / event.total) * 100))
    })
    xhr.addEventListener('loadend', () => {
      resolve(xhr.readyState === 4 && xhr.status === 200)
    })
    xhr.onreadystatechange = function () {
      // if (xhr.readyState === 4 && xhr.status === 200) console.log(xhr.responseXML)
    }
    xhr.onload = function () {
      //
    }
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.send(file)
  })
}
const randomString = (length) => {
  let result = ''

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

</script>
