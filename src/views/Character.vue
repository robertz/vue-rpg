<template>
  <div class="character container-fluid">
      <div class="columns mt-1" v-if="!character.init">
          <div class="column">

            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Name</label>
                </div>
                <div class="field-body">
                    <div class="control">
                        <input type="text" class="input" placeholder="Character Name" v-model="character.name">
                    </div>
                </div>
            </div>

            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Str</label>
                </div>
                <div class="field-body">
                    <div class="control">
                        <input type="number" class="input" min="1" max="30" v-model="character.stats.str">
                    </div>
                </div>
                <a class="button is-link" @click="setRandValue('str')">Random</a>
            </div>

            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Dex</label>
                </div>
                <div class="field-body">
                    <div class="control">
                        <input type="number" class="input" min="1" max="30" v-model="character.stats.dex">
                    </div>
                </div>
                <a class="button is-link" @click="setRandValue('dex')">Random</a>
            </div>

            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Con</label>
                </div>
                <div class="field-body">
                    <div class="control">
                        <input type="number" class="input" min="1" max="30" v-model="character.stats.con">
                    </div>
                </div>
                <a class="button is-link" @click="setRandValue('con')">Random</a>
            </div>

            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Int</label>
                </div>
                <div class="field-body">
                    <div class="control">
                        <input type="number" class="input" min="1" max="30" v-model="character.stats.int">
                    </div>
                </div>
                <a class="button is-link" @click="setRandValue('int')">Random</a>
            </div>

            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Wis</label>
                </div>
                <div class="field-body">
                    <div class="control">
                        <input type="number" class="input" min="1" max="30" v-model="character.stats.wis">
                    </div>
                </div>
                <a class="button is-link" @click="setRandValue('wis')">Random</a>
            </div>

            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Chr</label>
                </div>
                <div class="field-body">
                    <div class="control">
                        <input type="number" class="input" min="1" max="30" v-model="character.stats.chr">
                    </div>
                </div>
                <a class="button is-link" @click="setRandValue('chr')">Random</a>
            </div>

            <div>
                <a class="button is-success" @click="saveCharacter">Save</a>
            </div>
          </div>
          <div class="column">
             <p>Str Modifier: {{ character.stats.str | modifier }}</p>
             <p>Dex Modifier: {{ character.stats.dex | modifier }}</p>
             <p>Con Modifier: {{ character.stats.con | modifier }}</p>
             <p>Int Modifier: {{ character.stats.int | modifier }}</p>
             <p>Wis Modifier: {{ character.stats.wis | modifier }}</p>
             <p>Chr Modifier: {{ character.stats.chr | modifier }}</p>
          </div>
      </div>
      <div class="columns" v-else>
          <div class="column is-3">
              <div class="box">
                <h5 class="title">{{ character.name }}</h5>
                <div>
                  <h6 class="title is-6 is-spaced">Attributes</h6>
                  <div>Level: {{ character.attr.lvl }}</div>
                  <div>Exp: {{ character.attr.xp }}</div>
                  <div>HP: {{ character.attr.hp }}</div>
                </div>
                <div style="margin-top: 10px;">
                  <h6 class="title is-6 is-spaced">Stats</h6>
                  <div>Str: {{ character.stats.str }} ({{ character.stats.str | modifier | plussed }})</div>
                  <div>Dex: {{ character.stats.dex }} ({{ character.stats.dex | modifier | plussed }})</div>
                  <div>Con: {{ character.stats.con }} ({{ character.stats.con | modifier | plussed }})</div>
                  <div>Int: {{ character.stats.int }} ({{ character.stats.int | modifier | plussed }})</div>
                  <div>Wis: {{ character.stats.wis }} ({{ character.stats.wis | modifier | plussed }})</div>
                  <div>Chr: {{ character.stats.chr }} ({{ character.stats.chr | modifier | plussed }})</div>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'character',
  data () {
    return {}
  },
  methods: {
    roll: function (dice) {
      let count = dice.split('d')[0]
      let die = dice.split('d')[1]
      let result = 0
      for (let i = 0; i < count; i++) {
        result += Math.floor(Math.random() * die) + 1
      }
      return parseInt(result)
    },
    setRandValue: function (type) {
      this.character.stats[type] = this.roll('3d6')
    },
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
    },
    saveCharacter: function () {
      let c = this.character
      c.init = true
      // Computed values
      // hp + constituion bonus
      c.attr.hp = 12 + this.modifier(c.stats.con)
      c.attr.lvl = 1
      localStorage.setItem('character', JSON.stringify(c))
      this.$store.commit('SET_CHARACTER', c)
    }
  },
  filters: {
    plussed: function (value) {
      return parseInt(value) >= 0 ? '+' + value : value
    },
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
    }
  },
  computed: {
    ...mapState(['character'])
  }
}
</script>

<style lang="scss" scoped>
    .mt-1 {
        margin-top: .5em;
    }
</style>
