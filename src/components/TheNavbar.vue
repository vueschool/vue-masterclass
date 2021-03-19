<template>
  <header class="header" id="header">

    <router-link :to="{name: 'Home'}" class="logo">
      <img src="../assets/svg/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul>
        <li class="navbar-user">
          <a href="#">
            <img class="avatar-small" src="https://pbs.twimg.com/profile_images/1188775562657091594/5mgkg44t_400x400.jpg" alt="">
            <span>
                        Alex Kyriakidis
                        <img class="icon-profile" src="../assets/svg/arrow-profile.svg" alt="">
                    </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item"><a href="profile.html">View profile</a></li>
              <li class="dropdown-menu-item"><a href="#">Log out</a></li>
            </ul>
          </div>
        </li>
      </ul>

<!--      <ul>-->
<!--        <li class="navbar-item">-->
<!--          <a href="index.html">Home</a>-->
<!--        </li>-->
<!--        <li class="navbar-item">-->
<!--          <a href="category.html">Category</a>-->
<!--        </li>-->
<!--        <li class="navbar-item">-->
<!--          <a href="forum.html">Forum</a>-->
<!--        </li>-->
<!--        <li class="navbar-item">-->
<!--          <a href="thread.html">Thread</a>-->
<!--        </li>-->
<!--        &lt;!&ndash; Show these option only on mobile&ndash;&gt;-->
<!--        <li class="navbar-item mobile-only">-->
<!--          <a href="profile.html">My Profile</a>-->
<!--        </li>-->
<!--        <li class="navbar-item mobile-only">-->
<!--          <a href="#">Logout</a>-->
<!--        </li>-->
<!--      </ul>-->
    </nav>
  </header>
</template>

<script>
export default {}
</script>

<style scoped>

</style>
