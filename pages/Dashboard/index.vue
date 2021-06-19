<template>
  <v-layout
    column
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-form ref="entryForm" @submit.prevent="submitHandler">
        <v-row class="pa-2 ma-0" :style="{width: this.$vuetify.breakpoint.width+'px',background: '#F3EDED', position:'fixed',zIndex: 7}">
          <v-spacer />
          <v-btn class="white--text mr-5" small width="80" color="green" type="submit">
            Save
          </v-btn>
          <!-- <v-btn class="white--text mr-5" small width="80" color="#0F8CF3">
            Skill
          </v-btn>
          <v-btn class="white--text mr-5" small width="80" color="#0F8CF3">
            Department
          </v-btn> -->
          <v-btn class="white--text mr-5" small width="80" color="black" @click="$router.go(-1)">
            Cancel
          </v-btn>
        </v-row>
        <v-divider />
        <!------------------------------------------------------------------------ Panel -->
        <v-expansion-panels :value="[0,1,2]" multiple focusable class="px-5 mt-10 formContainer">
          <!---------------------------------------------------------------------- Basic Information -->
          <v-expansion-panel class="my-4">
            <v-expansion-panel-header class="text-h4 headerPanel">
              Basic Information
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="4" class="px-10 d-flex flex-column justify-space-between">
                  <CustomInput
                    v-model="code"
                    :label="'Code'"
                    :rules="codeRules"
                    :required="true"
                  />

                  <CustomInput
                    v-model="email"
                    :label="'Email'"
                    :rules="emailRules"
                    :required="true"
                  />

                  <CustomSelect
                    v-model="type"
                    :label="'Type'"
                    :items="typeItems"
                    :rules="typeRules"
                    :required="true"
                  />

                  <CustomSelect
                    v-model="status"
                    :label="'Status'"
                    :items="statusItems"
                    :rules="statusRules"
                    :required="true"
                  />
                </v-col>
                <v-col cols="12" sm="4" class="px-10 d-flex flex-column justify-space-between">
                  <CustomInput
                    v-model="fullName"
                    :label="'Full name'"
                    :rules="fullNameRules"
                    :required="true"
                  />
                  <!-- <CustomSelect
                    v-model="birthday"
                    :label="'Birthday'"
                    :items="birthdayItems"
                  /> -->

                  <v-menu
                    v-model="menuBirthday"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <CustomInput
                        v-model="birthday"
                        :readonly="true"
                        :bind="attrs"
                        :on="on"
                        :label="'Birthday'"
                      />
                    </template>
                    <v-date-picker v-model="birthday" no-title scrollable color="primary" @input="menuBirthday = false" />
                  </v-menu>

                  <CustomSelect
                    v-model="company"
                    :label="'Company'"
                    :items="companyItems"
                    :rules="companyRules"
                    :required="true"
                  />
                  <!-- <CustomSelect
                    v-model="joinedDate"
                    :label="'Joined Date'"
                    :items="joinedDateItems"
                    :rules="joinedDateRules"
                    :required="true"
                  /> -->
                  <v-menu
                    ref="menuJoinedDate"
                    v-model="menuJoinedDate"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <CustomInput
                        v-model="joinedDate"
                        :readonly="true"
                        :bind="attrs"
                        :on="on"
                        :label="'Joined Date'"
                        :rules="joinedDateRules"
                        :required="true"
                      />
                    </template>
                    <v-date-picker v-model="joinedDate" no-title scrollable color="primary" @input="menuJoinedDate = false" />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4" class="px-10 d-flex flex-column justify-space-between">
                  <div class="d-flex align-center flex-column ">
                    <v-img src="https://picsum.photos/510/300?random" height="150" width="100" aspect-ratio="1.7" />
                    <!-- <v-btn small width="10" class="mb-10">
                      Browse...
                    </v-btn> -->
                    <!-- <v-btn class="white--text text-h6 mb-10 mt-2" width="10" height="20" color="green">
                      Browse...
                    </v-btn> -->
                    <div>
                      <v-btn
                        class="white--text text-h6 mb-10 mt-2"
                        width="10"
                        height="20"
                        color="green"
                        :loading="isSelecting"
                        @click="onButtonClick"
                      >
                        {{ buttonText }}
                      </v-btn>
                      <input
                        ref="uploader"
                        class="d-none"
                        type="file"
                        accept="image/*"
                        @change="onFileChanged"
                      >
                    </div>
                  </div>
                  <v-spacer />
                  <div>
                    <!-- <p>End Date:</p> -->
                    <!-- <CustomSelect
                      v-model="endDate"
                      :label="'End Date'"
                      :items="endDateItems"
                    /> -->
                    <v-menu
                      v-model="menuEndDate"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <CustomInput
                          v-model="endDate"
                          :readonly="true"
                          :bind="attrs"
                          :on="on"
                          :label="'End Date'"
                        />
                      </template>
                      <v-date-picker v-model="endDate" no-title scrollable color="primary" @input="menuEndDate = false" />
                    </v-menu>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="px-10 d-flex flex-column justify-space-around">
                  <!-- <p>Address:</p> -->
                  <CustomInput v-model="address" :label="'Address'" />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!---------------------------------------------------------------------- Department -->
          <v-expansion-panel class="my-4">
            <v-expansion-panel-header class="text-h4 headerPanel">
              Department
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" class="px-10 d-flex flex-column justify-space-around">
                  <table>
                    <tr>
                      <th>Department</th>
                      <th>Start date</th>
                      <th>End date</th>
                      <th>Manager</th>
                      <th>Partner Unit Price</th>
                      <th>Partner OT Unit Price</th>
                    </tr>
                    <tr v-for="item in departmentList" :key="item.id">
                      <td>{{ item.department }}</td>
                      <td>{{ item.startDate }}</td>
                      <td>{{ item.endDate }}</td>
                      <td>{{ item.manager }}</td>
                      <td>{{ item.partner }}</td>
                      <td>{{ item.partnerOt }}</td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-------------------------------------------------------------------- Position -->
          <v-expansion-panel class="my-4">
            <v-expansion-panel-header class="text-h4 headerPanel">
              Position
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="4" class="px-10">
                  <!-- <p>Position:</p> -->
                  <CustomSelect
                    v-model="position"
                    :label="'Position'"
                    :items="positionItems"
                    :rules="positionRules"
                    :required="true"
                  />
                </v-col>
                <v-col cols="12" sm="4" class="px-10 ">
                  <!-- <p>Start Date:</p> -->
                  <!-- <CustomSelect
                    v-model="startDate"
                    :label="'Start Date'"
                    :items="startDateItems"
                    :rules="startDateRules"
                    :required="true"
                  /> -->
                  <v-menu
                    v-model="menuStartDate"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <CustomInput
                        v-model="startDate"
                        :readonly="true"
                        :bind="attrs"
                        :on="on"
                        :label="'Start Date'"
                      />
                    </template>
                    <v-date-picker v-model="startDate" no-title scrollable color="primary" @input="menuStartDate = false" />
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="px-10 ">
                  <table>
                    <tr>
                      <th>Position</th>
                      <th>Start date</th>
                      <th>End date</th>
                    </tr>
                    <tr v-for="item in positionList" :key="item.id">
                      <td>{{ item.position }}</td>
                      <td>{{ item.startDate }}</td>
                      <td>{{ item.endDate }}</td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        <!--  -->
        </v-expansion-panels>
        <!------------------------------------------------------------------------ Panel -->
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import CustomInput from '~/components/CustomInput'
import CustomSelect from '~/components/CustomSelect'

export default {
  components: { CustomInput, CustomSelect },
  data () {
    return {
      errors: [],
      code: '',
      codeRules: [],
      email: '',
      emailRules: [],
      type: '',
      typeRules: [],
      typeItems: ['Full time', 'Part time'],
      status: '',
      statusRules: [],
      statusItems: ['Working contract', 'Damm'],
      fullName: '',
      fullNameRules: [],
      birthday: '',
      menuBirthday: false,
      company: '',
      companyRules: [],
      companyItems: ['IVC', 'VNG', 'BOSCH', 'Zalo'],
      joinedDate: '',
      joinedDateRules: [],
      menuJoinedDate: false,
      avatarUrl: '',
      endDate: '',
      menuEndDate: false,
      address: '',
      departmentList: [
        // { id: 1, department: 'unit3', startDate: '11/2020', endDate: '', manager: 'Cao Ba Quat', partner: 'kfdsf', partnerOt: 'fdsa' },
        // { id: 2, department: 'unit2', startDate: '11/2020', endDate: '', manager: 'Trinh Cong Son', partner: 'kfdsf', partnerOt: 'fdsa' }
      ],
      position: '',
      positionRules: [],
      positionItems: ['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4'],
      startDate: '',
      startDateRules: [],
      menuStartDate: false,
      positionList: [
        // { id: 1, position: 'Rank 4', startDate: '11/2020', endDate: '' },
        // { id: 2, position: 'Rank 3', startDate: '11/2020', endDate: '12/2019' },
        // { id: 3, position: 'Rank 2', startDate: '11/2020', endDate: '12/2019' }
      ],
      defaultButtonText: 'Browse',
      selectedFile: null,
      isSelecting: false
    }
  },
  computed: {
    buttonText () {
      return this.selectedFile ? this.selectedFile.name : this.defaultButtonText
    }
  },
  methods: {
    onButtonClick () {
      this.isSelecting = true
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, { once: true })

      this.$refs.uploader.click()
    },
    onFileChanged (e) {
      this.selectedFile = e.target.files[0]

      // do something
    },
    submitHandler () {
      //  GIVE RULES
      this.codeRules = [v => !!v || 'MSG_E_016']
      this.emailRules = [v => !!v || 'MSG_E_029']
      this.typeRules = [v => !!v || 'MSG_E_027']
      this.statusRules = [v => !!v || 'MSG_E_030']
      this.fullNameRules = [v => !!v || 'MSG_E_031']
      this.companyRules = [v => !!v || 'MSG_E_032']
      this.joinedDateRules = [v => !!v || 'MSG_E_033']
      this.positionRules = [v => !!v || 'MSG_E_034']
      this.startDateRules = [v => !!v || 'MSG_E_035']

      // PUSH ERRORS
      const self = this
      setTimeout(() => {
        if (self.$refs.entryForm.validate()) {
          // console.log('success')
          this.$router.go(-1)
        } else {
          this.codeRules.map((item) => {
            if (typeof (item(this.code)) !== 'boolean') { this.errors.push(item(this.code)) }
          })
          this.emailRules.map((item) => {
            if (typeof (item(this.email)) !== 'boolean') { this.errors.push(item(this.email)) }
          })
          this.typeRules.map((item) => {
            if (typeof (item(this.type)) !== 'boolean') { this.errors.push(item(this.type)) }
          })
          this.statusRules.map((item) => {
            if (typeof (item(this.status)) !== 'boolean') { this.errors.push(item(this.status)) }
          })
          this.fullNameRules.map((item) => {
            if (typeof (item(this.fullName)) !== 'boolean') { this.errors.push(item(this.fullName)) }
          })
          this.companyRules.map((item) => {
            if (typeof (item(this.company)) !== 'boolean') { this.errors.push(item(this.company)) }
          })
          this.joinedDateRules.map((item) => {
            if (typeof (item(this.joinedDate)) !== 'boolean') { this.errors.push(item(this.joinedDate)) }
          })
          this.positionRules.map((item) => {
            if (typeof (item(this.position)) !== 'boolean') { this.errors.push(item(this.position)) }
          })
          this.startDateRules.map((item) => {
            if (typeof (item(this.startDate)) !== 'boolean') { this.errors.push(item(this.startDate)) }
          })
          if (this.errors.length > 0) {
            this.$ShowErrorPanel(this.errors)
          }
          this.errors = []
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

// input {
//     width:20px !important;
//     height: 20px !important;
// }
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;

}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
tr:nth-child(odd) {
  background-color: #dddddd;
}

// .formContainer {
//     p{
//         color:#2699FB;
//     }
// }
// // override color of input & combobox
// .theme--light.v-input input, .theme--light.v-input textarea {
//     color:#2699FB;
//     // font-size: 2rem;
// }
// .theme--light.v-select .v-select__selection--comma {
//     color: #2699FB;
//     // font-size: 2rem;
// }

// .theme--light.v-expansion-panels .v-expansion-panel {
//     background-color: #F3EDED;
//     color: rgba(0, 0, 0, 0.87);
// }
</style>
