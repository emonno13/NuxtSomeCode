<template>
  <v-form ref="entryForm" @submit.prevent="">
    <v-row
      justify="center"
      :style="{
        background: '#FDF8ED',
        height: $vuetify.breakpoint.height - 64 + 'px',
      }"
    >
      <v-col cols="6">
        <p>ID</p>
        <p>XXXXX12345678</p>
        <p>栄養士の表示名</p>
        <v-text-field
          v-model="subject"
          single-line
          outlined
          :rules="validateRuleSubject"
          dense
          background-color="white"
        />
        <p>メールアドレス</p>
        <v-text-field
          v-model="content"
          single-line
          outlined
          :rules="validateRuleContent"
          dense
          background-color="white"
        />
        <v-row>
          <v-col cols="6">
            <p>プロフィール画像</p>
            <v-row>
              <!-- -------- IMAGE   -->
              <v-col cols="6">
                <v-avatar
                  size="120"
                  color="primary"
                  tile
                  @click="selectAvatar"
                >
                  <img :src="avatar">
                </v-avatar>
                <v-file-input
                  ref="uploaderAvatar"
                  v-model="uploadedImageAvatar"
                  accept=".jpg, .png"
                  hide-input
                  prepend-icon=""
                  @change="onFileChangedAvatar"
                />
              </v-col>
              <!-- ------------------------ -->
              <v-col cols="6" class="d-flex flex-column">
                <p class="imageName">
                  {{
                    uploadedImageAvatar &&
                      uploadedImageAvatar.name
                  }}
                </p>
                <v-spacer />
                <v-btn
                  color="transparent"
                  :elevation="0"
                  fab
                  x-small
                  dark
                >
                  <v-icon color="#706F6D">
                    mdi-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="transparent"
                  :elevation="0"
                  fab
                  x-small
                  dark
                >
                  <v-icon color="#706F6D">
                    mdi-minus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <v-col col="6">
            <p>チャットアイコン</p>
            <v-row>
              <!-- -------- IMAGE   -->
              <v-col cols="6">
                <v-avatar
                  size="120"
                  color="primary"
                  tile
                  @click="selectIcon"
                >
                  <img :src="icon">
                </v-avatar>
                <v-file-input
                  ref="uploaderIcon"
                  v-model="uploadedImageIcon"
                  accept=".jpg, .png"
                  hide-input
                  prepend-icon=""
                  @change="onFileChangedIcon"
                />
              </v-col>
              <v-col cols="6" class="d-flex flex-column">
                <p class="imageName">
                  {{
                    uploadedImageIcon &&
                      uploadedImageIcon.name
                  }}
                </p>
                <v-spacer />
                <v-btn
                  color="transparent"
                  :elevation="0"
                  fab
                  x-small
                  dark
                >
                  <v-icon color="#706F6D">
                    mdi-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  color="transparent"
                  :elevation="0"
                  fab
                  x-small
                  dark
                >
                  <v-icon color="#706F6D">
                    mdi-minus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="pa-0" />
        <v-row justify="center">
          <v-btn
            class="mx-1 my-2 white--text"
            color="#D0CBC7"
          >
            戻る
          </v-btn>
          <v-btn
            class="mx-1 my-2 white--text"
            color="#F18D17"
            @click="submitHandler"
          >
            登録
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import * as Config from '@/config.js'
export default {
  data () {
    return {
      subject: '',
      content: '',
      validateRuleSubject: [],
      validateRuleContent: [],
      uploadedImageAvatar: null,
      uploadedImageIcon: null,
      selectedFile: null,
      isSelecting: false,
      avatar: '/user-avatar-add.png',
      icon: '/user-avatar-add.png'
    }
  },
  methods: {
    selectAvatar () {
      this.$refs.uploaderAvatar.$refs.input.click()
    },
    selectIcon () {
      this.$refs.uploaderIcon.$refs.input.click()
    },
    isImage (file) {
      if (file === undefined) {
        return true
      }
      const temp = file.name.split('.')
      const fileExt = temp[temp.length - 1]
      return fileExt === 'png' || fileExt === 'jpg'
    },
    onFileChangedAvatar (file) {
      const reader = new FileReader()
      const vm = this
      if (!this.isImage(this.uploadedImageAvatar)) {
        this.avatar = '/user-avatar-add.png'
        this.uploadedImageAvatar = null
      }
      if (
        this.uploadedImageAvatar != null &&
                this.isImage(this.uploadedImageAvatar)
      ) {
        reader.readAsDataURL(this.uploadedImageAvatar)
        reader.onload = () => {
          vm.avatar = reader.result
        }
      }
      console.log(this.uploadedImageAvatar.name)
    },
    onFileChangedIcon (file) {
      const reader = new FileReader()
      const vm = this
      if (!this.isImage(this.uploadedImageIcon)) {
        this.avatar = '/user-avatar-add.png'
        this.uploadedImageIcon = null
      }
      if (
        this.uploadedImageIcon != null &&
                this.isImage(this.uploadedImageIcon)
      ) {
        reader.readAsDataURL(this.uploadedImageIcon)
        reader.onload = () => {
          vm.icon = reader.result
        }
      }
    },
    // onFileChanged(e) {
    //     this.selectedFile = e.target.files[0]
    // },
    async submitHandler () {
      this.validateRuleSubject = await [
        v => !!v || Config.ERRMSG003,
        v => (v && v.length <= 64) || Config.ERRMSG009
      ]

      this.validateRuleContent = await [
        v => !!v || Config.ERRMSG003,
        v => (v && v.length <= 256) || Config.ERRMSG013
      ]

      const seft = this

      if (seft.$refs.entryForm.validate()) {
        try {
          // call API

          // eslint-disable-next-line no-constant-condition
          if (true) {
          } else {
            //  this.validateRule=[false || 'Error' , ]
            //  seft.$refs.entryForm.validate()
          }
        } catch (error) {
          //  this.validateRule=[false || 'Error' ,]
          //  seft.$refs.entryForm.validate()
        }
      }
    }
  }
}
</script>

<style style="scss">
.imageName {
    word-wrap: break-word;
}
/* .v-image__image {
    background-size: 100% 100%;
} */
</style>
