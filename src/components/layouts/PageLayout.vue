<template>
  <!-- SLOTS: #links #conteudo -->
  <div class="wrapper">
    <NavBar />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0">{{ titulo }}</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                  <slot name="links"></slot>
              </ol>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <div class="content">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <slot name="conteudo"></slot>
            </div>
            <!-- /.col-12 -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <MyFooter />
  </div>
  <!-- ./wrapper -->
</template>

<script>
import NavBar from "@/components/shared/NavBar.vue";
import MyFooter from "@/components/shared/MyFooter.vue";

export default {
  props: {
    titulo: String
  },
  components: {
    NavBar,
    MyFooter
  }
}
</script>

<style>

</style>