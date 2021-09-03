<template>
  <div class="app-container">

    <!-- 根据条件进行查询 -->
    <el-form :inline="true" label-width="80px" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.hosname" placeholder="医院名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.hoscode" placeholder="医院编号" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    </el-form>

    <!-- 批量删除 -->
    <div style="margin:0 0 10px 10px;">
      <el-button type="danger" size="mini" @click="removeRows()" style="font-size:14px">批量删除</el-button>
    </div>

    <!-- 医院设置列表 -->
    <!-- banner列表 -->
    <el-table :data="list" stripe style="width: 100%;text-align:left" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" />
      <el-table-column prop="hosname" label="医院名称" />
      <el-table-column prop="hoscode" label="医院编号" />
      <el-table-column prop="apiUrl" label="api基础路径" width="200" />
      <el-table-column prop="contactsName" label="联系人姓名" />
      <el-table-column prop="contactsPhone" label="联系人手机" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '可用' : '不可用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeDataById(scope.row.id)">
          </el-button>
          <!-- <el-button v-if="scope.row.stauts==1" type="primary" size="mini" icon="el-icon-delete"
            @click="lockHospSet(scope.row.id,0)">锁定</el-button>
          <el-button v-if="scope.row.stauts==0" type="danger" size="mini" icon="el-icon-delete"
            @click="lockHospSet(scope.row.id,1)">取消锁定</el-button> -->
          <el-button v-if="scope.row.status==1" type="primary" size="mini" icon="el-icon-lock" circle
            @click="lockHospSet(scope.row.id,0)"></el-button>
          <el-button v-if="scope.row.status==0" type="danger" size="mini" icon="el-icon-unlock" circle
            @click="lockHospSet(scope.row.id,1)"></el-button>
            <!-- 点击编辑按钮   回显指定id的数据 -->
          <router-link :to="'/hospSet/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle style="margin-left:10px;"></el-button>
          </router-link>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination :current-page="current" :page-size="limit" :total="total"
      style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper"
      @current-change="getList" />

  </div>

</template>

<script>
  import hospset from '@/api/hospset'

  export default {
    //   定义数据模型
    data() {
      return {
        current: 1, // 当前页
        limit: 3, // 每页显示记录数
        searchObj: {}, // 条件封装对象
        list: [], // 每页数据的集合
        total: 0, // 总记录数
        multipleSelection: [], // 批量选中选择的记录列表
      }
    },
    // 页面渲染成功后获取数据
    created() {
      this.getList()
    },
    methods: {
      // 加载列表数据
      getList(page = 1) {
        console.log('翻页...' + page)
        // 异步获取远程数据（ajax）
        this.current = page
        hospset.getHospSetList(this.current, this.limit, this.searchObj).then(
          response => {
            console.log(response)
            this.list = response.data.records
            this.total = response.data.total
          }
        ).catch(err => {
          console.log('请求失败!!!')
        })
      },
      removeDataById(id) {
        this.$confirm('此操作将永久删除医院的设置信息，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // 确定执行then方法
          // 调用接口
          hospset.deleteHospSet(id)
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // 调用getList()方法刷新页面
              this.getList(1)
              //  直接刷新页面
              //   window.location.reload()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //   当表格复选框发生变化的时候触发
      handleSelectionChange(selection) {
        this.multipleSelection = selection
        // console.log(this.multipleSelection)
      },
      //    批量删除方法
      removeRows() {
        this.$confirm('此操作将删除所有选中的设置信息，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { //  确定执行 then方法
          var idList = [];
          //   遍历数组得到每个id值   设置到idList当中
          for (let i = 0; i < this.multipleSelection.length; i++) {
            var obj = this.multipleSelection[i]
            var id = obj.id
            idList.push(id)
          }
          // 调用接口
          hospset.batchRemoveHospSet(idList)
            .then(response => {
              //   提示
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              //  刷新页面
              this.getList(1)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      //   锁定与取消锁定
      lockHospSet(id, status) {
        if (status == 0) {
          this.$confirm('是否锁定？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            hospset.lockHospSet(id, status)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '锁定成功'
                })
                this.getList()
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '未锁定'
            })
          })
        } else if (status == 1) {
          this.$confirm('是否解除锁定？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            hospset.lockHospSet(id, status)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '解除锁定成功'
                })
                this.getList()
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '未解除锁定'
            })
          })
        }

      }
    }

  }
</script>