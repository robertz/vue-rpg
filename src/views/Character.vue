<template>
    <div class="character container-fluid">
        <div class="row" v-if="!character.init">
            <div class="col-3 m-2">

                <div class="form-group">
                    <label for="cname" class="label">Name</label>
                    <input id="cname" type="text" class="form-control" placeholder="Character Name" v-model="character.name">
                </div>

                <div class="form-group row">
                    <div class="col-4">
                        <label for="cstr" class="label">Str</label>
                        <input id="cstr" type="number" class="form-control" min="1" max="30" maxlength="2" v-model="character.stats.str">
                    </div>
                    <div class="col-8 mt-4">
                        <button class="btn btn-primary" @click="setRandValue('str')">Random</button>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-4">
                        <label for="cdex" class="label">Dex</label>
                        <input id="cdex" type="number" class="form-control" min="1" max="30" maxlength="2" v-model="character.stats.dex">
                    </div>
                    <div class="col-8 mt-4">
                        <button class="btn btn-primary" @click="setRandValue('dex')">Random</button>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-4">
                        <label for="ccon" class="label">Con</label>
                        <input id="ccon" type="number" class="form-control" min="1" max="30" maxlength="2" v-model="character.stats.con">
                    </div>
                    <div class="col-8 mt-4">
                        <button class="btn btn-primary" @click="setRandValue('con')">Random</button>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-4">
                        <label for="cint" class="label">Int</label>
                        <input id="cint" type="number" class="form-control" min="1" max="30" maxlength="2" v-model="character.stats.int">
                    </div>
                    <div class="col-8 mt-4">
                        <button class="btn btn-primary" @click="setRandValue('int')">Random</button>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-4">
                        <label for="cwis" class="label">Wis</label>
                        <input id="cwis" type="number" class="form-control" min="1" max="30" maxlength="2" v-model="character.stats.wis">
                    </div>
                    <div class="col-8 mt-4">
                        <button class="btn btn-primary" @click="setRandValue('wis')">Random</button>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-4">
                        <label for="cstr" class="label">Chr</label>
                        <input id="cstr" type="number" class="form-control" min="1" max="30" maxlength="2" v-model="character.stats.chr">
                    </div>
                    <div class="col-8 mt-4">
                        <button class="btn btn-primary" @click="setRandValue('chr')">Random</button>
                    </div>
                </div>

                <div>
                    <button class="btn btn-success" @click="saveCharacter">Save</button>
                </div>
            </div>
            <div class="col-3 mt-2">
                <p>Str Modifier: {{ character.stats.str | modifier }}</p>
                <p>Dex Modifier: {{ character.stats.dex | modifier }}</p>
                <p>Con Modifier: {{ character.stats.con | modifier }}</p>
                <p>Int Modifier: {{ character.stats.int | modifier }}</p>
                <p>Wis Modifier: {{ character.stats.wis | modifier }}</p>
                <p>Chr Modifier: {{ character.stats.chr | modifier }}</p>
            </div>
        </div>

        <div class="row" v-if="character.init && character.attr.lvl === levelByExperience">
            <div class="col-3 m-2">
                <div class="card w-100">
                    <div class="card-body">
                        <h5 class="card-title">{{ character.name }}</h5>
                        <div>
                            <div class="card-subtitle mt-1 mb-2 text-muted">Attributes</div>
                            <div>Level: {{ character.attr.lvl }}</div>
                            <div>Exp: {{ character.attr.xp }}</div>
                            <div>HP: {{ character.attr.hp }}</div>
                        </div>
                        <div class="card-subtitle mt-1 mb-2 text-muted">Stats</div>
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

        <div class="row" v-if="character.init && character.attr.lvl < levelByExperience">
            <div class="col-3 mt-2">
                <div class="alert alert-success" role="alert">
                    You have leveled!
                </div>
                <div class="card mt-2">
                    <div class="card-body">

                        <div class="card-title">{{ character.name }}</div>
                        <div class="card-subtitle mt-1 mb-2 text-muted">Attributes</div>
                        <div>Level: {{ character.attr.lvl }}</div>
                        <div>Exp: {{ character.attr.xp }}</div>
                        <div>HP: {{ character.attr.hp }}</div>
                        <div>Points Available: {{ 2 - pointsAssigned }}</div>

                        <table class="table table-sm w-100 mt-2">
                            <thead class="thead-dark">
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
                                <td><button class="btn btn-primary" @click="addPoint('str')"> + </button></td>
                            </tr>
                            <tr>
                                <td>Dex</td>
                                <td>{{ character.stats.dex }}</td>
                                <td>{{ character.stats.dex | modifier | plussed }}</td>
                                <td><button class="btn btn-primary" @click="addPoint('dex')"> + </button></td>
                            </tr>
                            <tr>
                                <td>Con</td>
                                <td>{{ character.stats.con }}</td>
                                <td>{{ character.stats.con | modifier | plussed }}</td>
                                <td><button class="btn btn-primary" @click="addPoint('con')"> + </button></td>
                            </tr>
                            <tr>
                                <td>Int</td>
                                <td>{{ character.stats.int }}</td>
                                <td>{{ character.stats.int | modifier | plussed }}</td>
                                <td><button class="btn btn-primary" @click="addPoint('int')"> + </button></td>
                            </tr>
                            <tr>
                                <td>Wis</td>
                                <td>{{ character.stats.wis }}</td>
                                <td>{{ character.stats.wis | modifier | plussed }}</td>
                                <td><button class="btn btn-primary" @click="addPoint('wis')"> + </button></td>
                            </tr>
                            <tr>
                                <td>Chr</td>
                                <td>{{ character.stats.chr }}</td>
                                <td>{{ character.stats.chr | modifier | plussed }}</td>
                                <td><button class="btn btn-primary" @click="addPoint('chr')"> + </button></td>
                            </tr>
                        </table>

                    </div>
                </div>
                <button class="btn btn-danger mt-2 mr-2" @click="pointsAssigned = 0" :disabled="pointsAssigned === 0">Reset</button>
                <button class="btn btn-success mt-2" @click="saveLevel()" :disabled="pointsAssigned < 2">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import mixins from '../mixins/gameData.js'

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
    saveCharacter: function () {
      this.character.init = true

      // Add in racial bonuses
      let race = this.races.filter((race) => {
        return race.name === this.character.race
      })[0].stats
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
  computed: {
    ...mapState(['character'])
  },
  mixins: [mixins]
}
</script>
