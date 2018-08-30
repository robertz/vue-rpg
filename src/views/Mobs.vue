<template>
    <div class="mobs container-fluid">
        <div class="row">
            <div class="col-3">
                <div class="card">
                    <div class="card-body">
                        <input type="text" class="form-control mb-2" v-model="searchFilter" placeholder="Filter Mobs" />
                        <div class="mob-container" v-for="(mob, index) in filteredMobs" :key="index">
                            <a @click="setDetail(mob.name)">{{ mob.name }}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-9">
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
      mobs: mobData.filter((mob) => {
        return ('name' in mob)
      }),
      searchFilter: '',
      detail: {}
    }
  },
  methods: {
    setDetail: function (name) {
      this.detail = this.mobs.filter((mob) => {
        return mob.name === name
      })[0]
    }
  },
  filters: {
    pretty: function (value) {
      return JSON.stringify(value, null, 2)
    }
  },
  computed: {
    filteredMobs: function () {
      return this.searchFilter.length ? this.mobs.filter((mob) => {
        return mob.name.toLowerCase().indexOf(this.searchFilter.toLowerCase()) >= 0
      }) : this.mobs
    }
  }
}
</script>

<style lang="scss" scoped>
    .mob-container {
        a {
            &:hover {
                color:dodgerblue;
                cursor: pointer;
            }
        }
    }
</style>
