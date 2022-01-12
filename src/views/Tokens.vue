<template>
  <a-card>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{ padding: 0 }">
      <template #title>
        <a-row type="flex" align="middle">
          <a-col :span="24" :md="12">
            <h6>Tokens</h6>
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

        <template slot="editBtn" slot-scope="row,record">
          <a-button @click="showModal(record)" type="link" icon="form" :data-id="row.key" class="btn-edit">
            Edit
          </a-button>
          <a-button type="link" icon="delete" :data-id="row.key" class="btn-edit">
          <a-popconfirm v-if="tableData.length" title="Sure to delete?" @confirm="() => onDelete(record)">
            <a  href="javascript:;">Delete</a>
          </a-popconfirm>
          </a-button>
        </template>
      </a-table>
      <a-modal
            v-model="modal2Visible"
            title="Comapany Details"
            centered
            @ok="handleOk"
            @cancel="handleCancel"
            >
              <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item ref="name" label="Name" prop="name">
                  <a-input
                    v-model="form.name"
                    @blur="() => {$refs.name.onFieldBlur();}"/>
                </a-form-model-item>
              <a-form-model-item label="Offering" prop="offering">
                <a-select v-model="form.offering" placeholder="please select the branches eligible">
                  <a-select-option value="I">
                    Internship
                  </a-select-option>
                  <a-select-option value="F">
                   Full-Time
                  </a-select-option>
                  <a-select-option value="IF">
                    Internship + Full-Time
                  </a-select-option>
                </a-select>
              </a-form-model-item>

               <a-form-model-item label="Category" prop="tier">
                <a-select v-model="form.tier" placeholder="please select the branches eligible">
                  <a-select-option value="CSE">
                    Dream
                  </a-select-option>
                  <a-select-option value="ISE">
                    Mass
                  </a-select-option>
                  <a-select-option value="ECE">
                    Core
                  </a-select-option>
                </a-select>
              </a-form-model-item>
                  <a-form-model-item label=" Time" required prop="dueDate">
                  <a-date-picker
                    v-model="form.dueDate"
                    show-time
                    type="date"
                    placeholder="Pick a due-date and Time"
                    style="width: 100%;"
                  />
              </a-form-model-item>
              

            </a-form-model>
            <template slot="footer">
              <a-button key="back" @click="handleCancel">
                Return
              </a-button>
              <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
                Submit
              </a-button>
            </template>
          </a-modal>
    </a-card>
  </a-card>
</template>

<script>
import moment from 'moment'
// import db from "../firebase.config";
// import { collection, getDocs, deleteDoc, updateDoc, doc} from "firebase/firestore";
const columns = [
  {
    key: "name",
    title: "NAME",
    dataIndex: "name",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: "name",
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
    key: "offering",
    title: "OFFERING",
    dataIndex: "offering",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: "offering",
    },
    onFilter: (value, record) =>
      record.offering.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 0);
      }
    },
  },
  {
    key: "tier",
    title: "CATEGORY",
    dataIndex: "tier",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: "tier",
    },
    onFilter: (value, record) =>
      record.tier.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 0);
      }
    },
  },
  {
    key: "dueDate",
    title: "LAST DATE",
    dataIndex: "dueDate",
    class: "text-muted",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: "dueDate",
    },
    onFilter: (value, record) =>
      record.dueDate.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus();
        }, 0);
      }
    },
  },
  {
    key: "action",
    title: "ACTION",
    scopedSlots: { customRender: "editBtn" },
    width: 50,
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
//   beforeMount() {
//     getDocs(collection(db, "companies"))
//       .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           this.data.push({id: doc.id, ...doc.data()});
//          // this.tableData.push(doc.data());
      
//         });
//         this.tableData = this.data.map((element) => {
//           element.dueDate = moment(element.dueDate.toDate())
//           // element.dueDate = moment(element.dueDate.toDate()).toDate()
//           //  element.format("YYYY-MM-DD HH:mm:ss")
//           return element
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   },
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
    showModal(record){
      // console.log("hello")
      if(record) {
        this.selectedRecord = record
        this.form = {
          name: record.name,
          offering: record.offering,
          tier: record.tier,
          dueDate: record.dueDate, 
        }
      }
      this.modal2Visible = true
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