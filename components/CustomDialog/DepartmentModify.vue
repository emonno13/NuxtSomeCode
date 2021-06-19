<template>
  <div class="text-center">
    <v-dialog :value="value" :max-width="this.$vuetify.breakpoint.width/1.5 +'px'" @click:outside="closeDialog">
      <v-card>
        <v-container>
          <v-row justify="center" class="pr-5 pl-5">
            <v-expansion-panels :value="[0,1]" multiple focusable class="px-5">
              <v-expansion-panel class="my-4">
                <v-expansion-panel-header class="text-h5 headerPanel">
                  <v-col class="pa-0">
                    {{ name }}
                  </v-col>
                  <v-col class="ml-10 d-flex flex-row-reverse">
                    <v-btn class="white--text mr-5 text-cation" height="35" width="50" color="black" @click.native.stop="closeDialog">
                      Cancel
                    </v-btn>
                    <v-btn
                      class="white--text mr-5 text-caption"
                      height="35"
                      width="50"
                      color="green"
                      @click.native.stop="addItem"
                    >
                      Add
                    </v-btn>
                  </v-col>
                </v-expansion-panel-header>
                <!-- ----------------------------------------------------------------------- -->
                <v-expansion-panel-content>
                  <v-row>
                    <v-layout child-flex>
                      <v-data-table
                        :headers="headers"
                        :items="departmentList"
                        item-key="id"
                      >
                        <!-- EDIT DEPARTMENT -->
                        <template v-slot:[`item.department`]="props">
                          {{ props.item.department }}
                          <template v-if="isEdit === props.item.id">
                            <v-text-field
                              v-model="props.item.department"
                              label="Edit"
                              single-line
                              :max-lenght="20"
                              counter
                            />
                          </template>
                        </template>
                        <!-- EDIT START DATE -->
                        <template v-slot:[`item.startDate`]="props">
                          {{ props.item.startDate }}
                          <template v-if="isEdit === props.item.id">
                            <v-text-field
                              v-model="props.item.startDate"
                              label="Edit"
                              single-line
                              :max-lenght="20"
                              counter
                            />
                          </template>
                        </template>
                        <!--  -->
                        <!-- EDIT END DATE -->
                        <template v-slot:[`item.endDate`]="props">
                          {{ props.item.endDate }}
                          <template v-if="isEdit === props.item.id">
                            <v-text-field
                              v-model="props.item.endDate"
                              label="Edit"
                              single-line
                              :max-lenght="20"
                              counter
                            />
                          </template>
                        </template>
                        <!--  -->
                        <!-- EDIT MANAGER -->
                        <template v-slot:[`item.manager`]="props">
                          {{ props.item.manager }}
                          <template v-if="isEdit === props.item.id">
                            <v-text-field
                              v-model="props.item.manager"
                              label="Edit"
                              single-line
                              :max-lenght="20"
                              counter
                            />
                          </template>
                        </template>
                        <!--  -->
                        <!-- EDIT PARTNER UNIT PRICE -->
                        <template v-slot:[`item.partnerUnitPrice`]="props">
                          {{ props.item.partnerUnitPrice }}
                          <template v-if="isEdit === props.item.id">
                            <v-text-field
                              v-model="props.item.partnerUnitPrice"
                              label="Edit"
                              single-line
                              :max-lenght="20"
                              counter
                            />
                          </template>
                        </template>
                        <!--  -->
                        <!-- EDIT PARTNER OT UNIT PRICE -->
                        <template v-slot:[`item.partnerOTUnitPrice`]="props">
                          {{ props.item.partnerOTUnitPrice }}
                          <template v-if="isEdit === props.item.id">
                            <v-text-field
                              v-model="props.item.partnerOTUnitPrice"
                              label="Edit"
                              single-line
                              :max-lenght="20"
                              counter
                            />
                          </template>
                        </template>
                        <!--  -->
                        <!-- GROUP ACTIONS -->
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-row>
                            <v-icon v-if="isEdit !== item.id" small class="mr-2" @click="editItem(item)">
                              mdi-pencil
                            </v-icon>
                            <v-icon v-if="isEdit === item.id" small class="mr-2" @click="saveItem(item)">
                              mdi-check
                            </v-icon>
                            <v-icon small class="mr-2" @click="deleteItem(item)">
                              mdi-delete
                            </v-icon>
                          </v-row>
                        </template>
                        <!--  -->
                      </v-data-table>
                    </v-layout>
                  </v-row>
                  <!-- ---------------------------ADDING ITEM --------------------------------- -->
                  <v-card v-if="isAdd">
                    <v-card-title>
                      <span class="headline">ADDING DEPARTMENT</span>
                    </v-card-title>
                    <v-form ref="addingItemForm" @submit.prevent="">
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="4" class="px-2">
                            <v-combobox
                              v-model="newItem.department"
                              :items="departmentOptions"
                              :rules="departmentRules"
                              label="Department"
                              hide-details
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col cols="12" sm="4" class="px-2">
                            <v-combobox
                              v-model="newItem.startDate"
                              :items="startDateOptions"
                              :rules="startDateRules"
                              label="Start Date"
                              hide-details
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col cols="12" sm="4" class="px-2">
                            <v-combobox
                              v-model="newItem.endDate"
                              :items="endDateOptions"
                              :rules="endDateRules"
                              label="End Date"
                              hide-details
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col cols="12" sm="4" class="px-2">
                            <v-combobox
                              v-model="newItem.manager"
                              :items="managerOptions"
                              :rules="managerRules"
                              label="Manager"
                              hide-details
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col cols="12" sm="4" class="px-2">
                            <v-combobox
                              v-model="newItem.partnerUnitPrice"
                              :items="partnerUnitPriceOptions"
                              :rules="partnerUnitPriceRules"
                              label="Partner Unit Price"
                              hide-details
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col cols="12" sm="4" class="px-2">
                            <v-combobox
                              v-model="newItem.partnerOTUnitPrice"
                              :items="partnerOTUnitPriceOptions"
                              :rules="partnerOTUnitPriceRules"
                              label="Partner OT Unit Price"
                              hide-details
                              outlined
                              dense
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-form>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="blue darken-1" text @click="closeAddingItem">
                        Cancel
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="saveAddingItem">
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                  <!--  -->
                </v-expansion-panel-content>
                <!-- ----------------------------------------------------------------------- -->
                <v-row />
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DepartmentList from '../../api/mock/departmentList.json'
export default {
  props: {
    value: undefined,
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isEdit: '',
      isAdd: false,
      errors: [],

      departmentRules: [],
      startDateRules: [],
      endDateRules: [],
      managerRules: [],
      partnerUnitPriceRules: [],
      partnerOTUnitPriceRules: [],

      departmentOptions: ['Unit/Sec8', 'Unit3/Sec10'],
      startDateOptions: ['20/01/1997'],
      endDateOptions: ['20/01/1997'],
      managerOptions: ['Lubu', 'Xinzhao', 'Yasuo', 'Yone'],
      partnerUnitPriceOptions: [3, 4, 5, 6],
      partnerOTUnitPriceOptions: [4, 5, 6, 6],

      newItem: {
        id: '_' + Math.random().toString(36).substr(2, 9),
        department: '',
        startDate: '',
        endDate: '',
        manager: '',
        partnerUnitPrice: '',
        partnerOTUnitPrice: ''
      },
      defaultItem: {
        id: '',
        department: '',
        startDate: '',
        endDate: '',
        manager: '',
        partnerUnitPrice: '',
        partnerOTUnitPrice: ''
      },
      pagination: {},
      headers: [
        {
          text: 'Department',
          align: 'start',
          sortable: false,
          value: 'department'
        },
        { text: 'Start date', value: 'startDate' },
        { text: 'End date', value: 'endDate' },
        { text: 'Manager', value: 'manager' },
        { text: 'Partner Unit Price', value: 'partnerUnitPrice', sortable: false },
        { text: 'Partner OT Unit Price', value: 'partnerOTUnitPrice', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      generateId: '',
      newItemIndex: -1,
      departmentList: JSON.parse(JSON.stringify(DepartmentList))
    }
  },
  updated () {
    this.generateId = Date.now() + Math.random().toString(36).substr(2, 9)
    this.defaultItem.id = this.generateId
  },
  methods: {
    // SET RULES
    setRules () {
      this.departmentRules = [v => !!v || 'Department is required']
      this.startDateRules = [v => !!v || 'Start date is required']
      this.endDateRules = [v => !!v || 'End date is required']
      this.managerRules = [v => !!v || 'Manager is required']
      this.partnerUnitPriceRules = [v => !!v || 'Partner unit price is required']
      this.partnerOTUnitPriceRules = [v => !!v || 'Partner OT unit is required']
    },
    // SET ERRORS
    setErrors () {
      this.departmentRules.map((item) => {
        if (typeof (item(this.newItem.department)) !== 'boolean') { this.errors.push(item(this.newItem.department)) }
      })
      this.startDateRules.map((item) => {
        if (typeof (item(this.newItem.startDate)) !== 'boolean') { this.errors.push(item(this.newItem.startDate)) }
      })
      this.endDateRules.map((item) => {
        if (typeof (item(this.newItem.endDate)) !== 'boolean') { this.errors.push(item(this.newItem.endDate)) }
      })
      this.managerRules.map((item) => {
        if (typeof (item(this.newItem.manager)) !== 'boolean') { this.errors.push(item(this.newItem.manager)) }
      })
      this.partnerUnitPriceRules.map((item) => {
        if (typeof (item(this.newItem.partnerUnitPrice)) !== 'boolean') { this.errors.push(item(this.newItem.partnerUnitPrice)) }
      })
      this.partnerOTUnitPriceRules.map((item) => {
        if (typeof (item(this.newItem.partnerOTUnitPrice)) !== 'boolean') { this.errors.push(item(this.newItem.partnerOTUnitPrice)) }
      })
    },
    // ADD ITEMS
    addItem (item) {
      this.isAdd = true
    },
    saveAddingItem () {
      this.setRules()
      const self = this
      setTimeout(() => {
        if (self.$$refs.addingItemForm.validate()) {
          alert('submitted')
          this.departmentList.push(this.newItem)
          this.closeAddingItem()
        } else {
          this.setErrors()
          if (this.errors.length > 0) {
            alert('Error here')
          }
          this.errors = []
        }
      })
    },
    closeAddingItem () {
      this.isAdd = false
      this.$nextTick(() => {
        this.newItem = Object.assign({}, this.defaultItem)
        this.newItemIndex = -1
      })
    },
    // EDIT & SAVE & DELETE
    editItem (item) {
      console.log(item)
      this.isEdit = item.id
    },
    saveItem (item) {
      console.log(item)
      this.isEdit = ''
    },
    deleteItem (item) {
      const index = this.departmentList.indexOf(item)
      confirm('Are you sure you want to delete this item ?') && this.departmentList.splice(index, 1)
    },
    closeDialog () {
      this.$emit('eventCloseDialog')
    }
  }
}
</script>

<style>

</style>
