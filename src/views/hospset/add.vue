<template>
  <div class="app-container">
    医院设置添加
    <br>
    <hr>
    <el-form label-width="120px">
      <el-form-item label="医院名称">
        <el-input v-model="hospitalSet.hosname" />
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="hospitalSet.hoscode" />
      </el-form-item>
      <el-form-item label="api基础路径">
        <el-input v-model="hospitalSet.apiUrl" />
      </el-form-item>
      <el-form-item label="联系人姓名">
        <el-input v-model="hospitalSet.contactsName" />
      </el-form-item>
      <el-form-item label="联系人手机">
        <el-input v-model="hospitalSet.contactsPhone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import hospset from '@/api/hospset'

  export default {
    //   定义数据模型
    data() {
      return {
        hospitalSet: {} //   传递保存的数据对象
      }
    },
    // 页面渲染成功后获取数据
    created() {
      // 获取路由id值 调用接口获取医院设置信息
      //   console.log(this.$route.params)
      //   this.$route包含index.js中设置的所有路由模块信息
      //   console.log(this.$route)
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getHospSet(id)
      }
    },
    methods: {
      save() {
        hospset.saveHospSet(this.hospitalSet)
          .then(response => {
            //   提示
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            // 跳转列表页面 使用路由跳转的形式实现  跳转到当前目录下的list.vue页面
            this.$router.push({
              path: '/hospset/list'
            })
          })
      },
      //   根据id查询 并将数据回显到页面中
      getHospSet(id) {
        hospset.getHospSet(id)
          .then(response => {
            this.hospitalSet = response.data
          })
      },
      //   修改医院设置信息
      update() {
        hospset.updateHospSet(this.hospitalSet)
          .then(response => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            //   跳转到列表页面 使用路由跳转方式实现
            this.$router.push({
              path: '/hospset/list'
            })
          })
      },
      saveOrUpdate() {
        //   判断是添加还是修改
        if (!this.hospitalSet.id) { //  没有id 则添加
          this.save()
        } else { //  修改
          this.update()
        }
      }
    }
  }
</script>