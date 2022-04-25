<template>
  <div id="Topnav">
    <div class="container">
      <el-row>
        <el-col :span="5">
          <div class="topnav-logo">
            <img src="@/assets/img/index_logo_240-180.png" />
          </div>
        </el-col>
        <el-col :span="13">
          <div class="search">
            <div class="searchbar">
              <el-autocomplete
                class="searchinput"
                v-model="searchinput"
                placeholder="请输入"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                @select="handleSelect"
              >
                <el-select v-model="searchselect" slot="prepend">
                  <el-option value="宝贝"></el-option>
                  <el-option value="店铺"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  class="searchbtn"
                ></el-button>
              </el-autocomplete>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="topnav-ad" v-if="this.showad">
            <img src="@/assets/img/index_logo_240-180.png" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchinput: "",
      searchselect: "宝贝",
      options: [],
      value: [],
      list: [],
      loading: false,
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
      // querysql:
      // [
      //   ["三全鲜食（北新泾店）","长宁区新渔路144号"],
      //   ["Hot honey 首尔炸鸡（仙霞路）","上海市长宁区淞虹路661号"],
      // ],
      querylist: [],
    };
  },

  props:{
    browserwidth:{
      type: Number,
      required: true,
    }
  },

  computed: {
    showad(){
      if(this.browserwidth < 1160){
        return 0
      } else {
        return 1
      }
    }
  },

  methods: {
    querySearch(queryString, cb) {
      this.commAPI
        .get("/search/index", {
          queryString: queryString,
        })
        .then((res) => {
          let list = res.data.list.map((items) => {
            return { value: `${items[0]}`, address: `${items[1]}` };
          });
          cb(list);
        })
        .catch(function (err) {
          console.log("检索失败" + err);
        });
    }, //搜索栏方法
    handleSelect(value) {
      console.log(value);
    }, //点击搜索
  },
  mounted() {
    this.list = this.states.map((item) => {
      return { value: `value:${item}`, label: `${item}` };
    });
    // this.querylist = this.querysql.map((items) => {
    //     return { value: `${items[0]}`, address: `${items[1]}` };
    // });
    // this.querylist = this.querysql()
  },
};
</script>
<style lang='less'>
#Topnav {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: rgb(253, 229, 229);
  .container {
    margin: auto;
    min-width: 800px;
    width: 90%;
    .el-col {
      height: 100%;
    }
  }
}
.topnav-logo {
  width: 140px;
  height: 100px;
  margin: auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.search {
  margin: auto;
  height: 80px;
  width: 600px;
  position: relative;
  .searchbar {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    .searchinput {
      width: 600px;
    }
    .el-select {
      width: 80px;
      height: 40px;
      line-height: 40px;
      float: left;
    }
    .searchbtn {
      right: 80px;
    }
  }
}
.topnav-ad{
  width: 140px;
  height: 100px;
  margin: auto;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>