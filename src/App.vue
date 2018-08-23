<template>
  <div id="app" class="is-fluid">

    <nav class="navbar is-link" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link class="navbar-item" to="/">
              <h6 class="title is-6 has-text-white">VUE-RPG</h6>
            </router-link>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <router-link class="navbar-item" to="/character">Character</router-link>
                <router-link class="navbar-item" to="/combat">Combat</router-link>
                <router-link class="navbar-item" to="/mobs">Mobs</router-link>
                <router-link class="navbar-item" to="/about">About</router-link>
            </div>
        </div>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
    @import '../node_modules/bulma/bulma.sass';
</style>
