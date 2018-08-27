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
      <div class="columns" v-if="character.init && character.attr.lvl === levelByExperience">
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
      <div class="columns" v-if="character.init && character.attr.lvl < levelByExperience">
          <div class="column is-3">
            <div class="notification is-success">
              You have leveled
            </div>
            <div class="box">
              <h5 class="title">{{ character.name }}</h5>
              <div>
                <h6 class="title is-6 is-spaced">Attributes</h6>
                <div>Level: {{ character.attr.lvl }}</div>
                <div>Exp: {{ character.attr.xp }}</div>
                <div>HP: {{ character.attr.hp }}</div>
                <div>Points Available: {{ 2 - pointsAssigned }}</div>
              </div>
              <div style="margin-top: 10px;">
                <table class="table is-narrow is-fullwidth">
                  <thead>
                    <tr>
                      <th>Stat</th>
                      <th>Val</th>
                      <th>Mod</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tr>
                    <td>Str</td>
                    <td>{{ character.stats.str }}</td>
                    <td>{{ character.stats.str | modifier | plussed }}</td>
                    <td><a class="button is-info" @click="addPoint('str')"> + </a></td>
                  </tr>
                  <tr>
                    <td>Dex</td>
                    <td>{{ character.stats.dex }}</td>
                    <td>{{ character.stats.dex | modifier | plussed }}</td>
                    <td><a class="button is-info" @click="addPoint('dex')"> + </a></td>
                  </tr>
                  <tr>
                    <td>Con</td>
                    <td>{{ character.stats.con }}</td>
                    <td>{{ character.stats.con | modifier | plussed }}</td>
                    <td><a class="button is-info" @click="addPoint('con')"> + </a></td>
                  </tr>
                  <tr>
                    <td>Int</td>
                    <td>{{ character.stats.int }}</td>
                    <td>{{ character.stats.int | modifier | plussed }}</td>
                    <td><a class="button is-info" @click="addPoint('int')"> + </a></td>
                  </tr>
                  <tr>
                    <td>Wis</td>
                    <td>{{ character.stats.wis }}</td>
                    <td>{{ character.stats.wis | modifier | plussed }}</td>
                    <td><a class="button is-info" @click="addPoint('wis')"> + </a></td>
                  </tr>
                  <tr>
                    <td>Chr</td>
                    <td>{{ character.stats.chr }}</td>
                    <td>{{ character.stats.chr | modifier | plussed }}</td>
                    <td><a class="button is-info" @click="addPoint('chr')"> + </a></td>
                  </tr>
                </table>
              </div>

              <br>
              <a class="button is-link" @click="saveLevel()">Save</a>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import gameData from '../gameData.json'

export default {
  name: 'character',
  data () {
    return {
      pointsAssigned: 0
    }
  },
  methods: {
    addPoint: function (attr) {
      if (this.pointsAssigned === 2) return
      this.character.stats[attr] += 1
      this.pointsAssigned += 1
    },
    roll: function (dice) {
      let count = dice.split('d')[0]
      let die = dice.split('d')[1]
      let result = 0
      for (let i = 0; i < count; i++) {
        result += Math.floor(Math.random() * die) + 1
      }
      return parseInt(result)
    },
    saveLevel: function () {
      this.character.attr.hp += 7 + this.modifier(this.character.stats.con) // warrior
      this.character.attr.lvl += 1
      this.pointsAssigned = 0
      localStorage.setItem('character', JSON.stringify(this.character))
      this.$store.commit('SET_CHARACTER', this.character)
    },
    setRandValue: function (type) {
      this.character.stats[type] = this.roll('3d6')
    },
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
    },
    saveCharacter: function () {
      this.character.init = true

      // Add in racial bonuses
      let race = gameData.races.filter((race) => { return race.name === this.character.race })[0].stats
      for (let stat in race) {
        this.character.stats[stat] = parseInt(this.character.stats[stat]) + race[stat]
      }

      // hp + constituion bonus
      this.character.attr.hp = 10 + this.modifier(this.character.stats.con) // warrior
      this.character.attr.lvl = 1
      localStorage.setItem('character', JSON.stringify(this.character))
      this.$store.commit('SET_CHARACTER', this.character)
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
    pointsAvailable: function () {
      // Two extra points to spend on stats per level
      return this.levelByExperience > 1 ? (this.levelByExperience - 1) * 2 : 0
    },
    levelByExperience: function () {
      // calculate the level the character should be by experience
      let level = 1
      for (let i = 0; i < gameData.advancement.length; i++) {
        level = this.character.attr.xp >= gameData.advancement[i].xp ? gameData.advancement[i].level : level
      }
      return level
    },
    ...mapState(['character'])
  }
}
</script>

<style lang="scss" scoped>
    .character {
      padding: 16px;
    }
</style>
