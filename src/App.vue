<template>
  <div id="app">

    <nav class="navbar navbar-expand-sm navbar-dark bg-dark mb-3">
        <router-link class="navbar-brand" to="/">VUE-RPG</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" to="/character">Character</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/combat">Combat</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/mobs">Mobs</router-link>
                </li>
            </ul>
        </div>
    </nav>

    <router-view/>
  </div>
</template>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap';
</style>
