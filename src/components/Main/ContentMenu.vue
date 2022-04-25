<template>
  <div id="contentmenu">
    <div class="adcolumn ad-left" v-if="adshow">
      <img src="@/assets/img/ad.webp" />
    </div>
    <div class="container">
      <div class="main">
        <div class="navigationmenu">
          <el-menu
            router
            :collapse="true"
            background-color="rgb(73, 80, 96)"
            text-color="rgba(255,255,255,0.7)"
            unique-opened
          >
            <Menu :routerList="categorydata"></Menu>
          </el-menu>
        </div>
        <div class="slideshow">
          <el-carousel>
            <el-carousel-item v-for="item in 4" :key="item">
              <img :src="require(`@/assets/img/slideshow/slideshow_${item}.webp`)" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <div class="adcolumn ad-right" v-if="adshow">
      <img src="@/assets/img/ad.webp" />
    </div>
  </div>
</template>

<script>
import Menu from "../UnitComponents/Menu.vue";
export default {
  data() {
    return {
      categorydata: [],
    };
  },

  props: {
    browserwidth: {
      type: Number,
    },
  },

  components: {
    Menu,
  },

  computed: {
    adshow() {
      if (this.browserwidth < 1230) {
        return 0;
      } else {
        return 1;
      }
    },
  },

  methods: {
    ConstructTree(data) {

      var obj = [];
      var temp = {};

      data.map((item) => {
        if (item.cat_pid == 0) {

          item.name = item.cat_name;
          item.path = `/${item.id}`;
          obj.push(item);

          temp[item.id] = item;

        } else {

          item.name = item.cat_name;
          item.name = item.cat_name;
          item.path = `menu/${item.id}`;

          temp[item.id] = item;

          if (temp[item.cat_pid]) {

            if (temp[item.cat_pid].hasOwnProperty("children") == false) {

              temp[item.cat_pid].children = [];

            }

            temp[item.cat_pid].children.push(item);

          } else {

            console.log(`${item.id} 父id未找到`);

          }
        }
      });
      this.categorydata = obj;
    },
  },

  mounted() {
    this.commAPI
      .get("/search/category")
      .then((res) => {
        if (res.data.obj) {
          this.ConstructTree(res.data.obj);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
<style lang='less'>
#contentmenu {
  height: 400px;
  width: 100%;
  .container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 400px;
    width: 900px;
    .main {
      margin: auto;
      display: table;
      white-space: -1em;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      .slideshow .el-carousel,
      .slideshow .el-carousel__container,
      .slideshow img
      {
        height: 100%;
        width: 100%;
      }
    }
  }
  .adcolumn {
    position: absolute;
    height: 400px;
    width: 180px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.navigationmenu {
  height: 400px;
  width: 200px;
  display: inline-block;
  vertical-align: top;
  background: rgb(73, 80, 96);
  .el-menu--collapse {
    width: calc(~"100% - 1px");
    border-right: none;
    span {
      height: 100%;
      width: 80%;
      visibility: visible;
    }
    i.el-submenu__icon-arrow {
      height: 20px;
      width: 20px;
      visibility: visible;
    }
  }
  // .el-cascader-panel {
  //   height: 400px;
  //   .el-cascader-menu {
  //     &:first-child {
  //       min-width: 200px;
  //       // width: 200px;
  //     }
  //   }
  //   .el-cascader-menu__wrap {
  //     height: 100%;
  //   }
  //   .el-scrollbar__wrap {
  //     overflow-x: hidden;
  //   }
  // }
}
.slideshow {
  height: 400px;
  width: 600px;
  display: inline-block;
  vertical-align: top;
}
#contentmenu {
  .ad-left {
    left: 0;
  }
  .ad-right {
    right: 0;
  }
}
</style>