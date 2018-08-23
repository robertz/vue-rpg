<template>
    <div class="mobs container-fluid">
        <div class="columns">
          <div class="column is-3">
            <div class="box">
              <input type="text" v-model="searchFilter" />
              <div v-for="(mob, index) in filteredMobs" :key="index">
                <a @click="setDetail(mob.name)">{{ mob.name }}</a>
              </div>
            </div>
          </div>
          <div class="column is-9">
            <pre>{{ detail | pretty }}</pre>
          </div>
        </div>
    </div>
</template>

<script>
import mobData from '../5e-SRD-Monsters.json'

export default {
  name: 'mobs',
  data () {
    return {
      mobs: mobData.filter((mob) => { return ('name' in mob) }),
      searchFilter: '',
      detail: {}
    }
  },
  methods: {
    setDetail: function (name) {
      this.detail = this.mobs.filter((mob) => { return mob.name === name })[0]
    }
  },
  filters: {
    pretty: function (value) {
      return JSON.stringify(value, null, 2)
    }
  },
  computed: {
    filteredMobs: function () {
      return this.searchFilter.length ? this.mobs.filter((mob) => { return mob.name.toLowerCase().indexOf(this.searchFilter.toLowerCase()) >= 0 }) : this.mobs
    }
  }
}
</script>
