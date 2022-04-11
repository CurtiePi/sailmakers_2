Vue.config.ignoredElements = [/^ion-/]

<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary fixed-top">
    <div class="container">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#Navbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand mr-auto" href="#"><img src="img/icons/sailing_logo.png" height="40" width="41" alt="Sailmakers"/></a>
<div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
      <ul class="navbar-nav">
        <li class="nav-item dropdown ms-3"
            v-for="(link, index) in navLinks"
            :key="index"
        >
          <a class="nav-link dropdown-toggle fw-bold" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false"
            :style="{color: '#FFF'}"
          >
           <ion-icon :name="link.icon"></ion-icon>
           {{ link.text }} 
          </a>
          <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
            <li class="dropdown-item"
                v-for="(subNavLink, subindex) in link.subNavLinks"
                :key="subindex"
            >
                <router-link class="text-decoration-none" v-if="subNavLink.param"
                    :to="{name: subNavLink.name, params: {'atomic': subNavLink.param.value } }"
                    :style="{color: '#FFF'}"
                >
                    <ion-icon :name="subNavLink.icon"></ion-icon>
                    {{ subNavLink.text }}
                </router-link>
                <router-link class="text-decoration-none" v-else
                    :to="{ name: subNavLink.name }"
                    :style="{color: '#FFF'}"
                >
                    <ion-icon :name="subNavLink.icon"></ion-icon>
                    {{ subNavLink.text }}
                </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    </div>
  </nav>
</template>

<script>
import headerLinks from '@/assets/HeaderLinks'

export default{
  props: ['background', 'linkColor', 'hoverBackground'],
  components: {
  },
  data () {
    return {
      navLinks: headerLinks 
    }
  },
  methods: {
    expandTab (event) {
      event.currentTarget.style.background = this.hoverBackground || '#999'
      event.currentTarget.lastChild.style.display = 'block'
    },
    compressTab (event) {
      event.currentTarget.style.background = this.background || '#333'
      event.currentTarget.lastChild.style.display = 'none'
    }
  }
}
</script>
<style scoped>

  .parent {
    position: absolute;
    display: none;
    width: 200px;
    background-color: #fff;
    background: #fff;

    ul {
      display: flex;
      flex-direction: column;
    }

    li {
      border: 2px solid #f0f;
    }

    a {
      border: 2px solid #ff0;
      text-decoration: none;
      display: flex;
      flex-direction: row-reverse;
    }
  }
</style>
