<template>
    <div class="combat container-fluid">
        <div class="row">
            <div class="col m-1">

                <div class="card">
                    <div class="card-body">
                        <div class="card-title">{{ character.name }}</div>
                        <div class="card-subtitle text-muted">Attributes</div>
                        <div>Level: {{ character.attr.lvl }}</div>
                        <div>Exp: {{ character.attr.xp }}</div>
                        <div>HP: {{ character.current.hp }} / {{ character.attr.hp }}</div>
                        <div>Coin: {{ coin }}</div>

                        <div class="card-subtitle mt-1 text-muted">Stats</div>
                        <div>Str: {{ character.stats.str }} ({{ character.stats.str | modifier | plussed }})</div>
                        <div>Dex: {{ character.stats.dex }} ({{ character.stats.dex | modifier | plussed }})</div>
                        <div>Con: {{ character.stats.con }} ({{ character.stats.con | modifier | plussed }})</div>
                        <div>Int: {{ character.stats.int }} ({{ character.stats.int | modifier | plussed }})</div>
                        <div>Wis: {{ character.stats.wis }} ({{ character.stats.wis | modifier | plussed }})</div>
                        <div>Chr: {{ character.stats.chr }} ({{ character.stats.chr | modifier | plussed }})</div>
                    </div>
                </div>

                <p class="card-subtitle mt-1 text-muted">Challenge Rating</p>
                <select class="form-control mt-1" v-model="challengeRating">
                        <option value="">Any</option>
                        <option v-for="(cr, i) in challengeRatingData" :value="cr.challenge_rating" :key="i">{{ cr.challenge_rating }}</option>
                    </select>

                <button class="btn btn-primary mt-1" v-if="(mobsAlive && alive) && !canLevel" @click="eventLoop">Attack</button>
                <button class="btn btn-primary mt-1" v-if="(!mobsAlive || !alive) && !canLevel" @click="restart">Restart Combat</button>
                <router-link class="btn btn-warning mt-1" v-if="canLevel" to="/character">Level Up!</router-link>
            </div>

            <div class="col m-1">
                <div v-for="(opponent, i) in opponents" :key="i" class="card">
                    <div class="card-body">
                        <div class="card-title mb-1">{{ opponent.name }}</div>
                        Challenge Rating: {{ opponent.challenge_rating }}<br /> HP: {{ opponent._hit_points }} / {{ opponent.hit_points }}
                        <h6 class="title is-6">Stats</h6>
                        <div>Str: {{ opponent.strength }} ({{ opponent.strength | modifier | plussed }})</div>
                        <div>Dex: {{ opponent.dexterity }} ({{ opponent.dexterity | modifier | plussed }})</div>
                        <div>Con: {{ opponent.constitution }} ({{ opponent.constitution | modifier | plussed }})</div>
                        <div>Int: {{ opponent.intelligence }} ({{ opponent.intelligence | modifier | plussed }})</div>
                        <div>Wis: {{ opponent.wisdom }} ({{ opponent.wisdom | modifier | plussed }})</div>
                        <div>Chr: {{ opponent.charisma }} ({{ opponent.charisma | modifier | plussed }})</div>
                    </div>
                </div>
            </div>

            <div class="col mt-1">
                <div class="card">
                    <div class="card-body">
                        <p class="card-title">Combat Log</p>
                        <div v-for="(item, index) in combatLog" :key="index">{{ item }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import mobData from '../5e-SRD-Monsters.json'
import mixins from '../mixins/gameData.js'

export default {
  name: 'combat',
  data () {
    return {
      challengeRating: '',
      challengeRatingData: [],
      mobs: mobData.filter((mob) => {
        return ('name' in mob)
      }),
      alive: true,
      mobsAlive: false,
      rounds: 0,
      hasInitiative: false,
      opponents: [],
      combatLog: [],
      treasure: 0
    }
  },
  methods: {
    getTreasure: function (cr) {
      let tr
      switch (cr) {
        case '0':
        case '1/8':
        case '1/4':
        case '1/2':
        case '1':
        case '2':
        case '3':
        case '4':
          tr = this.roll('1d100')
          if (tr <= 30) {
            this.treasure = this.roll('5d6')
          }
          if (tr >= 31 && tr <= 70) {
            this.treasure = this.roll('4d6') * 10
          }
          if (tr >= 71 && tr <= 100) {
            this.treasure = this.roll('3d6') * 100
          }
          break
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
          tr = this.roll('1d100')
          if (tr <= 30) {
            this.treasure = this.roll('4d6') * 100
          }
          if (tr >= 31 && tr <= 70) {
            this.treasure = this.roll('6d6') * 100 * 10
          }
          if (tr >= 71 && tr <= 100) {
            this.treasure = this.roll('4d6') * 100 * 100
          }
          break
        case '11':
        case '12':
        case '13':
        case '14':
        case '15':
        case '16':
          tr = this.roll('1d100')
          if (tr <= 30) {
            this.treasure = this.roll('4d6') * 100 * 10
          }
          if (tr >= 31 && tr <= 70) {
            this.treasure = this.roll('2d6') * 100 * 100
          }
          if (tr >= 71 && tr <= 100) {
            this.treasure = this.roll('4d6') * 100 * 100
          }
          break
        case '17':
        case '18':
        case '19':
        case '20':
        case '21':
        case '22':
        case '23':
        case '24':
        case '25':
        case '26':
        case '27':
        case '28':
        case '29':
        case '30':
          tr = this.roll('1d100')
          if (tr <= 15) {
            this.treasure = this.roll('8d6') * 100
          }
          if (tr >= 16 && tr <= 70) {
            this.treasure = this.roll('8d6') * 100 * 1000
          }
          if (tr >= 71 && tr <= 100) {
            this.treasure = this.roll('16d6') * 100 * 1000
          }
          break
        default:
          break
      }
    },
    pcAttack: function () {
      let pcAtk = this.roll('1d20')
      switch (pcAtk) {
        case 1:
          this.combatLog.push('You rolled a 1 for attack roll. You missed!')
          break
        case 20:
          this.combatLog.push('You rolled a 20 for attack roll. Critical Hit!')
          let baseDmg = this.roll('1d6', true) + this.modifier(this.character.stats.str)
          this.combatLog.push(`You hit the ${this.opponents[0].name} for ${baseDmg} points of damage.`)
          this.opponents[0]._hit_points -= baseDmg
          break
        default:
          let doesHit = pcAtk + this.modifier(this.character.stats.str) + this.byLevel.proficiency > this.opponents[0].armor_class
          if (doesHit) {
            let baseDmg = this.roll('1d6') + this.modifier(this.character.stats.str)
            this.combatLog.push(`You hit the ${this.opponents[0].name} for ${baseDmg} points of damage.`)
            this.opponents[0]._hit_points -= baseDmg
          } else {
            this.combatLog.push(`You attack the ${this.opponents[0].name}, but miss!`)
          }
          break
      }
    },
    npcAttack: function () {
      // calculate attack for each opponent
      for (let m = 0; m < this.opponents.length; m++) {
        if (this.character.current.hp > 0) { // if alive and opponents alive
          let npcAtk = this.roll('1d20')

          let validActions = this.opponents[m].actions.filter((action) => {
            return ('damage_dice' in action)
          }) || []
          let selectedAction = validActions[Math.floor(Math.random() * validActions.length)]

          let attackBonus = ('attack_bonus' in selectedAction) ? selectedAction.attack_bonus : 0
          let damageBonus = ('damage_bonus' in selectedAction) ? selectedAction.damage_bonus : 0

          let baseDmg = 0

          switch (npcAtk) {
            case 1:
              this.combatLog.push(this.opponents[m].name + ' rolled a 1 for attack roll. It missed!')
              break
            case 20:
              this.combatLog.push(this.opponents[m].name + ' rolled a 20 for attack roll. Critical Hit!')
              baseDmg = this.roll(selectedAction.damage_dice, true) + this.modifier(this.opponents[m].strength) + damageBonus
              this.combatLog.push(`${this.opponents[m].name}: ${selectedAction.name} for ${baseDmg} points of damage.`)
              this.character.current.hp -= baseDmg
              break
            default:
              baseDmg = this.roll(selectedAction.damage_dice) + damageBonus
              let doesHit = npcAtk + this.modifier(this.opponents[m].strength) + attackBonus > this.character.attr.ac
              if (doesHit) {
                this.combatLog.push(`${this.opponents[m].name}: ${selectedAction.name} for ${baseDmg} points of damage.`)
                this.character.current.hp -= baseDmg
              } else {
                this.combatLog.push(`${this.opponents[m].name}: ${selectedAction.name}, but misses!`)
              }
          }
        }
      }
    },
    eventLoop: function () {
      if (this.rounds === 0) {
        this.hasInitiative = this.character.stats.dex + this.modifier(this.character.stats.dex) > this.opponents[0].dexterity + this.modifier(this.opponents[0].dexterity)
        this.opponents[0]._hit_points = this.opponents[0].hit_points
      }
      this.rounds++
      this.mobsAlive = this.opponents.filter((op) => {
        return op._hit_points > 0
      }).length > 0

      // if hasInit player goes first, otherwise opponents go first
      if (this.hasInitiative) {
        this.pcAttack()

        this.mobsAlive = this.opponents.filter((op) => {
          return op._hit_points > 0
        }).length > 0

        if (this.mobsAlive) {
          this.npcAttack()
        }
      } else {
        // calculate attack for each opponent
        this.npcAttack()
        if (this.character.current.hp > 0) {
          this.pcAttack()
        }
      }

      this.alive = this.character.current.hp > 0
      this.mobsAlive = this.opponents.filter((op) => {
        return op._hit_points > 0
      }).length > 0

      // All opponents are dead and pc is alive
      if (!this.mobsAlive && this.alive) {
        this.combatLog.push('You have won!!!!')

        for (let i = 0; i < this.opponents.length; i++) {
          this.character.attr.xp += this.challengeRatingData.filter((cr) => {
            return cr.challenge_rating === this.opponents[i].challenge_rating
          })[0].xp
        }

        // throw in some coin
        this.getTreasure(this.challengeRating)

        let ref = this.treasure
        let p = Math.floor(ref / 1000)
        ref -= p * 1000
        let g = Math.floor(ref / 100)
        ref -= g * 100
        let s = Math.floor(ref / 10)
        ref -= s * 10
        let c = ref

        this.combatLog.push(`You find ${p}p ${g}g ${s}s ${c}c after the battle!`)
        this.character.attr.cp += this.treasure

        this.$store.commit('SET_CHARACTER', this.character)
        this.saveCharacter(this.character)
      }

      // DED
      if (this.mobsAlive && !this.alive) {
        this.combatLog.push('You have died!!!!')
      }
    },
    restart: function () {
      this.$store.dispatch('refreshCharacter')
      this.character.current.hp = this.character.attr.hp
      this.rounds = 0
      this.opponents = []
      this.combatLog = []

      let isValid = false
      let op
      let filteredMobs

      if (this.challengeRating.length) {
        filteredMobs = this.mobs.filter((mob) => {
          return mob.challenge_rating === this.challengeRating
        })
      }

      // Not all monsters have damage rolls... this weeds out any bad data (i.e., Sprite)
      while (!isValid) {
        op = this.challengeRating.length ? filteredMobs[Math.floor(Math.random() * filteredMobs.length)] : this.mobs[Math.floor(Math.random() * this.mobs.length)]
        isValid = op.actions.filter((action) => {
          return ('damage_dice' in action)
        }).length > 0
      }

      this.opponents.push(op)

      // this.opponents.push(this.mobs.filter((mob) => { return mob.name === 'Sprite' })[0])

      for (let i = 0; i < this.opponents.length; i++) {
        this.opponents[i]._hit_points = this.opponents[i].hit_points
      }

      this.alive = true
      this.mobsAlive = true
    },
    saveCharacter: function () {
      localStorage.setItem('character', JSON.stringify(this.character))
      this.$store.dispatch('refreshCharacter')
    }
  },
  computed: {
    byLevel: function () {
      return this.advancement.filter((data) => {
        return data.level === this.character.attr.lvl
      })[0]
    },
    ...mapState(['character'])
  },
  mixins: [mixins]
}
</script>
