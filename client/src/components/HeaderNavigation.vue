Vue.config.ignoredElements = [/^ion-/]

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand mr-auto" href="#"><img src="img/icons/sailing_logo.png" height="40" width="41" alt="Sailmakers"/></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb2 mb-lg-0">
          <li class="nav-item dropdown ms-3"
            v-for="(link, index) in navLinks"
            :key="index"
          >
            <a class="nav-link dropdown-toggle fw-bold" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false"
              :style="{color: '#FFF'}"
            >
               <i :class="link.icon" />
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
                  <i :class="subNavLink.icon" />
                    {{ subNavLink.text }}
                  </router-link>
                <router-link class="text-decoration-none" v-else
                    :to="{ name: subNavLink.name }"
                    :style="{color: '#FFF'}"
                >
                  <i :class="subNavLink.icon" />
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
.dropdown-menu-dark {
    background-color: teal;
}
</style>
