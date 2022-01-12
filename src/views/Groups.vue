<template>
  <a-card>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{ padding: 0 }">
      <template #title>
        <a-row type="flex" align="middle">
          <a-col :span="24" :md="12">
            <h6>Roles</h6>
          </a-col>
          <a-col
            :span="24"
            :md="12"
            style="
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <a-radio-group v-model="branchBtns" size="small">
              <a-radio-button value="Recieved">Recieved</a-radio-button>
              <a-radio-button value="Sent">Sent</a-radio-button>
            </a-radio-group>
          </a-col>
        </a-row>
      </template>
      <a-table rowKey="id" :columns="columns" :data-source="tableData" :pagination="false" :rowSelection="{onSelect: onSelectChange,}">
        <div slot="filterDropdown" slot-scope="{
            setSelectedKeys, selectedKeys, confirm, clearFilters, column,}" style="padding: 8px">
          <a-input v-ant-ref="(c) => (searchInput = c)" :placeholder="`Search ${column.dataIndex}`" :value="selectedKeys[0]" style="width: 188px; margin-bottom: 8px; display: block" @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : []) " @pressEnter="
              () => handleSearch(selectedKeys, confirm, column.dataIndex) "/>
          <a-button type="primary" icon="search" size="small" style="width: 90px; margin-right: 8px" @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)">
            Search
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="() => handleReset(clearFilters)"
          >
            Reset
          </a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <template slot="customRender" slot-scope="text, record, index, column">
          <span v-if="searchText && searchedColumn === column.dataIndex">
            <template
              v-for="(fragment, i) in text
                .toString()
                .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
            >
              <mark
                v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                :key="i"
                class="highlight"
              >
                {{ fragment }}
              </mark>
              <template v-else>
                {{ fragment }}
              </template>
            </template>
          </span>
          <template v-else>
            {{ text }}
          </template>
        </template>

        <template slot="name" slot-scope="name">
          <div class="avatar-info">
            <h6>{{ name }}</h6>
          </div>
        </template>

        <template slot="offering" slot-scope="offering">
          <div class="avatar-info">
            <h6>{{ offering }}</h6>
          </div>
        </template>

        <template slot="tier" slot-scope="tier">
          <div class="avatar-info">
            <h6>{{ tier }}</h6>
          </div>
        </template>

        <template slot="dueDate" slot-scope="dueDate">
          <div class="avatar-info">
            <h6>{{ dueDate.format('llll') }}</h6>
          </div>
        </template>
      </a-table>
    </a-card>
  </a-card>
</template>

<script>
import moment from 'moment'
// import db from "../firebase.config";
// import { collection, getDocs, deleteDoc, updateDoc, doc} from "firebase/firestore";
const columns = [
  {
    key: "_id",
    title: "ID",
    dataIndex: "_id",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
    },
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 0);
      }
    },
  },
  {
    key: "name",
    title: "NAME",
    dataIndex: "name",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
    },
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 0);
      }
    },
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
    },
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 0);
      }
    },
  },
  {
    key: "permissions",
    title: "PERMISSIONS",
    dataIndex: "permissions",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
    },
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 0);
      }
    },
  },
  {
    key: "roles",
    title: "ROLES",
    dataIndex: "roles",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
    },
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 0);
      }
    },
  },
];
export default {
  data() {
    return {
      columns,
      loading: false,
      data: [],
      modal2Visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      disabled: true,
      branchBtns: "all",
      tableData: [],
      form: {
          name: null,
          offering: null,
          tier: null,
          dueDate: null,
        },
        rules: {
        name: [{ required: true, message: 'Please input Name of the Company', trigger: 'blur' }],
        offering: [{ required: true, message: 'Please select an Offering', trigger: 'blur' }],
        tier: [{ required: true, message: 'Please select a Category', trigger: 'blur' }],
        dueDate: [{ required: true, message: 'Please select last date to apply', trigger: 'blur' }],
      },
    };
  },
  beforeMount() {
    this.$http.get("/roles").then(({data}) => {
      this.tableData = data.data
    }).catch(err => {
      console.error(err)
      this.$notification.error({
        message: 'Failed to fetch data',
        description: err.response? err.response.message : err.message
      });
    })
  },
  methods: {
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleOk() {
    //    this.$refs.ruleForm.validate(valid => {
    //      if (valid) {
    //         this.loading = true
    //         //  console.log(this.selectedRecord)
    //         if(this.selectedRecord){
    //           updateDoc(doc(db,"companies", this.selectedRecord.id),{
    //             name: this.form.name,
    //             offering: this.form.offering,
    //             tier: this.form.tier,
    //             dueDate: this.form.dueDate.toDate(),
    //           }).then(() => {
    //             // console.log("then")
    //             this.modal2Visible = false;
    //             this.$refs.ruleForm.resetFields();
    //             this.$notification.open({
    //               message: 'Company Details updated successfully',
    //             });
    //           }).catch((error) => {
    //             // console.log("catch")
    //             console.log("Error:", error)
    //           }).finally(() => {
    //             // console.log("finally")
    //             this.loading = false
    //           });
    //         } else {
    //           // console.log("here")
            // }
        //   }
    //   });
      
    },
    handleCancel(){
      this.modal2Visible = false;
      this.$refs.ruleForm.resetFields();
    },
    // oncompanyclick(record){
    //   this.$router.push({name:'company', params: {companyname: record.name}});
    // },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    onSelectChange() {
      console.log("details of selected companies");
    },
    async onDelete(record) {
    //   await deleteDoc(doc(db, "companies", record.id));
       this.$notification.open({
        message: 'Company deleted successfully',
      });
    },
  },
  watch: {
    branchBtns(val) {
      // console.log(val);
      if (val == "all") {
        this.tableData = this.data;
      } else {
        // console.log(this.data);
        this.tableData = this.data.filter((companies) => {
          return companies.tier.toUpperCase() == val.toUpperCase();
        });
      }
    },
  },
};
</script>
