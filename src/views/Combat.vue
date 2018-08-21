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
    this.opponents[0] = this.monsters[0]

    this.$store.commit('SET_CHARACTER', this.character)
  },
  data () {
    return {
      rounds: 0,
      alive: true,
      hasInitiative: false,
      opponents: [],
      combatLog: []
    }
  },
  methods: {
    eventLoop: function () {
      if (this.rounds === 0) {
        this.hasInitiative = this.character.stats.dex + this.modifier(this.character.stats.dex) > this.opponents[0].stats.dex + this.modifier(this.opponents[0].stats.dex)
        this.opponents[0].attr._hp = this.opponents[0].attr.hp
      }
      this.rounds++

      this.combatLog.push(`Round ${this.rounds}:`)
      // if hasInit player goes first, otherwise opponents go first
      if (this.hasInitiative) {
        this.combatLog.push(`${this.character.name} attacking:`)

        let pcAtk = this.roll('1d20')
        switch (pcAtk) {
          case 1:
            this.combatLog.push('You rolled a 1 for attack roll. You missed!')
            break
          case 20:
            this.combatLog.push('You rolled a 20 for attack roll. Critical Hit!')
            let baseDmg = this.roll('2d6') + this.modifier(this.character.stats.str)
            this.combatLog.push(`You hit for ${baseDmg} points of damage.`)
            this.opponents[0].attr._hp -= baseDmg
            break
          default:
            let doesHit = pcAtk + this.modifier(this.character.stats.str) > this.opponents[0].attr.ac
            if (doesHit) {
              let baseDmg = this.roll('1d6') + this.modifier(this.character.stats.str)
              this.combatLog.push(`You hit for ${baseDmg} points of damage.`)
              this.opponents[0].attr._hp -= baseDmg
            } else {
              this.combatLog.push('You swing, but miss the creature')
            }
            break
        }

        // calculate attack for each opponent
        for (let m = 0; m < this.opponents.length; m++) {
          this.combatLog.push(`${this.opponents[m].name} attacking:`)

          let npcAtk = this.roll('1d20')
          switch (npcAtk) {
            case 1:
              this.combatLog.push(this.opponents[m].name + ' rolled a 1 for attack roll. It missed!')
              break
            case 20:
              this.combatLog.push(this.opponents[m].name + ' rolled a 20 for attack roll. Critical Hit!')
              let baseDmg = this.roll('2d6') + this.modifier(this.opponents[m].stats.str)
              this.combatLog.push(`You have been hit for ${baseDmg} points of damage.`)
              this.character.current.hp -= baseDmg
              break
            default:
              let doesHit = npcAtk + this.modifier(this.opponents[m].stats.str) > this.character.attr.ac
              if (doesHit) {
                let baseDmg = this.roll('1d6') + this.modifier(this.opponents[m].stats.str)
                this.combatLog.push(`You have been hit for ${baseDmg} points of damage.`)
                this.character.current.hp -= baseDmg
              } else {
                this.combatLog.push('The creature swings but misses you')
              }
              break
          }
        }
      } else {
        // calculate attack for each opponent
        for (let m = 0; m < this.opponents.length; m++) {
          this.combatLog.push(`${this.opponents[m].name} attacking:`)

          let npcAtk = this.roll('1d20')
          switch (npcAtk) {
            case 1:
              this.combatLog.push(this.opponents[m].name + ' rolled a 1 for attack roll. It missed!')
              break
            case 20:
              this.combatLog.push(this.opponents[m].name + ' rolled a 20 for attack roll. Critical Hit!')
              let baseDmg = this.roll('2d6') + this.modifier(this.opponents[m].stats.str)
              this.combatLog.push(`You have been hit for ${baseDmg} points of damage.`)
              this.character.current.hp -= baseDmg
              break
            default:
              let doesHit = npcAtk + this.modifier(this.opponents[m].stats.str) > this.character.attr.ac
              if (doesHit) {
                let baseDmg = this.roll('1d6') + this.modifier(this.opponents[m].stats.str)
                this.combatLog.push(`You have been hit for ${baseDmg} points of damage.`)
                this.character.current.hp -= baseDmg
              } else {
                this.combatLog.push('The creature swings but misses you')
              }
              break
          }
        }

        this.combatLog.push(`${this.character.name} attacking:`)
        let pcAtk = this.roll('1d20')
        switch (pcAtk) {
          case 1:
            this.combatLog.push('You rolled a 1 for attack roll. You missed!')
            break
          case 20:
            this.combatLog.push('You rolled a 20 for attack roll. Critical Hit!')
            let baseDmg = this.roll('2d6') + this.modifier(this.character.stats.str)
            this.combatLog.push(`You hit for ${baseDmg} points of damage.`)
            this.opponents[0].attr._hp -= baseDmg
            break
          default:
            let doesHit = pcAtk + this.modifier(this.character.stats.str) > this.opponents[0].attr.ac
            if (doesHit) {
              let baseDmg = this.roll('1d6') + this.modifier(this.character.stats.str)
              this.combatLog.push(`You hit for ${baseDmg} points of damage.`)
              this.opponents[0].attr._hp -= baseDmg
            } else {
              this.combatLog.push('You swing, but miss the creature')
            }
            break
        }
      }

      if (!this.inCombat && this.alive) {
        this.combatLog.push('You have won!!!!')

        this.character.attr.xp += 25

        this.$store.commit('SET_CHARACTER', this.character)
        this.saveCharacter(this.character)
      }
    },
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
    },
    restart: function () {
      this.character.current.hp = this.character.attr.hp
      this.opponents[0] = this.monsters[0]
      this.opponents[0].attr._hp = this.opponents[0].attr.hp
      this.rounds = 0
      this.combatLog = []
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
    inCombat: function () {
      if (this.character.current.hp < 1) return false
      return !!this.opponents.filter((i) => { return i.attr._hp > 0 }).length
    },
    ...mapState(['character', 'data', 'monsters'])
  }
}
</script>
