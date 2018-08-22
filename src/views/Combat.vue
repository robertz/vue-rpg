<template>
<div class="combat container-fluid">
    <div class="columns">
        <div class="column">
          <div>You: {{ character.current.hp }}</div>
          <div v-for="(opponent, i) in opponents" :key="i">{{ opponent.name }}: {{ opponent.attr._hp }}</div>
          <a class="button is-primary" v-if="inCombat" @click="eventLoop">Attack</a>
          <a class="button is-primary" v-else @click="restart">Restart Combat</a>
        </div>
        <div class="column">
            <ul>
                <li v-for="(item, index) in combatLog" :key="index">{{ item }}</li>
            </ul>
        </div>
    </div>

</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'combat',
  created () {
    this.character.current.hp = this.character.attr.hp
    this.$store.commit('SET_CHARACTER', this.character)

    this.restart()
  },
  data () {
    return {
      rounds: 0,
      hasInitiative: false,
      opponents: [],
      combatLog: []
    }
  },
  methods: {
    pcAttack: function () {
      this.combatLog.push(`${this.character.name} attacking:`)
      let pcAtk = this.roll('1d20')
      switch (pcAtk) {
        case 1:
          this.combatLog.push('You rolled a 1 for attack roll. You missed!')
          break
        case 20:
          this.combatLog.push('You rolled a 20 for attack roll. Critical Hit!')
          let baseDmg = this.roll('1d6', true) + this.modifier(this.character.stats.str)
          this.combatLog.push(`You hit the ${this.opponents[0].name} for ${baseDmg} points of damage.`)
          this.opponents[0].attr._hp -= baseDmg
          break
        default:
          let doesHit = pcAtk + this.modifier(this.character.stats.str) > this.opponents[0].attr.ac
          if (doesHit) {
            let baseDmg = this.roll('1d6') + this.modifier(this.character.stats.str)
            this.combatLog.push(`You hit the ${this.opponents[0].name} for ${baseDmg} points of damage.`)
            this.opponents[0].attr._hp -= baseDmg
          } else {
            this.combatLog.push(`You attack the ${this.opponents[0].name}, but miss!`)
          }
          break
      }
    },
    npcAttack: function () {
      // calculate attack for each opponent
      for (let m = 0; m < this.opponents.length; m++) {
        if (this.inCombat) { // if alive and opponents alive
          this.combatLog.push(`${this.opponents[m].name} attacking:`)
          let npcAtk = this.roll('1d20')
          switch (npcAtk) {
            case 1:
              this.combatLog.push(this.opponents[m].name + ' rolled a 1 for attack roll. It missed!')
              break
            case 20:
              this.combatLog.push(this.opponents[m].name + ' rolled a 20 for attack roll. Critical Hit!')
              let weap = this.opponents[m].weapons[0]
              let baseDmg = this.roll(weap.dmg, true) + this.modifier(this.opponents[m].stats.str) + weap.dmgBonus
              this.combatLog.push(`${this.opponents[m].name} hits you with a ${weap.name} for ${baseDmg} points of damage.`)
              this.character.current.hp -= baseDmg
              break
            default:
              let doesHit = npcAtk + this.modifier(this.opponents[m].stats.str) + this.opponents[m].weapons[0].hitBonus > this.character.attr.ac
              if (doesHit) {
                let baseDmg = this.roll(this.opponents[m].weapons[0].dmg) + this.opponents[m].weapons[0].dmgBonus
                this.combatLog.push(`${this.opponents[m].name} hits you with a ${this.opponents[m].weapons[0].name} for ${baseDmg} points of damage.`)
                this.character.current.hp -= baseDmg
              } else {
                this.combatLog.push(`The ${this.opponents[m].name} attacks with a ${this.opponents[m].weapons[0].name}, but misses!`)
              }
              break
          }
        }
      }
    },
    eventLoop: function () {
      if (this.rounds === 0) {
        this.hasInitiative = this.character.stats.dex + this.modifier(this.character.stats.dex) > this.opponents[0].stats.dex + this.modifier(this.opponents[0].stats.dex)
        this.opponents[0].attr._hp = this.opponents[0].attr.hp
      }
      this.rounds++
      this.combatLog.push(`Round ${this.rounds}:`)

      // if hasInit player goes first, otherwise opponents go first
      if (this.hasInitiative) {
        this.pcAttack()
        if (this.inCombat) {
          this.npcAttack()
        }
      } else {
        // calculate attack for each opponent
        this.npcAttack()
        if (this.inCombat) {
          this.pcAttack()
        }
      }

      // All opponents are dead and pc is alive
      if (!this.inCombat && this.alive) {
        this.combatLog.push('You have won!!!!')

        for (let i = 0; i < this.opponents.length; i++) {
          this.character.attr.xp += this.opponents[i].attr.xp
        }

        this.$store.commit('SET_CHARACTER', this.character)
        this.saveCharacter(this.character)
      }

      // DED
      if (!this.inCombat && !this.alive) {
        this.combatLog.push('You have died!!!!')
      }
    },
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
    },
    restart: function () {
      this.character.current.hp = this.character.attr.hp
      this.opponents = []

      this.opponents.push(this.monsters[ Math.floor(Math.random() * this.monsters.length) ])

      this.rounds = 0
      this.combatLog = []
    },
    roll: function (dice, critical = false) {
      // critical roles should roll double ie 1d6 becomes 2d6
      let count = critical ? dice.split('d')[0] * 2 : dice.split('d')[0]
      let die = dice.split('d')[1]
      let result = 0
      for (let i = 0; i < count; i++) {
        result += Math.floor(Math.random() * die) + 1
      }
      return parseInt(result)
    },
    saveCharacter: function () {
      localStorage.setItem('character', JSON.stringify(this.character))
      this.$store.dispatch('refreshCharacter')
    }
  },
  filters: {
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
    }
  },
  computed: {
    alive: function () {
      return this.character.current.hp > 0
    },
    inCombat: function () {
      return !!this.opponents.filter((i) => { return i.attr._hp > 0 }).length && this.character.current.hp > 0
    },
    ...mapState(['character', 'data', 'monsters'])
  }
}
</script>
