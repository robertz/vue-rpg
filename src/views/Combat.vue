<template>
<div class="combat container-fluid">
    <div class="columns">
        <div class="column char">

            <div class="box">
              <h5 class="title is-5">{{ character.name }}</h5>
              <div>
                <h6 class="title is-6 is-spaced">Attributes</h6>
                <div>Level: {{ character.attr.lvl }}</div>
                <div>Exp: {{ character.attr.xp }}</div>
                <div>HP: {{ character.current.hp }} / {{ character.attr.hp }}</div>
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

            <p>Challenge Rating</p>
            <div class="select is-rounded">
              <select v-model="challengeRating">
                <option value="">Any</option>
                <option v-for="(cr, i) in challengeRatingData" :value="cr.challenge_rating" :key="i">{{ cr.challenge_rating }}</option>
              </select>
            </div>

            <br><br>

            <a class="button is-primary" v-if="mobsAlive && alive" @click="eventLoop">Attack</a>
            <a class="button is-primary" v-if="!mobsAlive || !alive" @click="restart">Restart Combat</a>

        </div>

        <div class="column char">
          <div v-for="(opponent, i) in opponents" :key="i" class="box">
            <h5 class="title is-5">{{ opponent.name }}</h5>
            Challenge Rating: {{ opponent.challenge_rating }}<br />
            HP: {{ opponent._hit_points }} / {{ opponent.hit_points }}

            <h6 class="title is-6">Stats</h6>
            <div>Str: {{ opponent.strength }} ({{ opponent.strength | modifier | plussed }})</div>
            <div>Dex: {{ opponent.dexterity }} ({{ opponent.dexterity | modifier | plussed }})</div>
            <div>Con: {{ opponent.constitution }} ({{ opponent.constitution | modifier | plussed }})</div>
            <div>Int: {{ opponent.intelligence }} ({{ opponent.intelligence | modifier | plussed }})</div>
            <div>Wis: {{ opponent.wisdom }} ({{ opponent.wisdom | modifier | plussed }})</div>
            <div>Chr: {{ opponent.charisma }} ({{ opponent.charisma | modifier | plussed }})</div>
          </div>
        </div>

        <div class="column char">
          <div class="box is-full-height">
            <h5 class="title is-5">Combat Log</h5>
            <div v-for="(item, index) in combatLog" :key="index">{{ item }}</div>
          </div>
        </div>
    </div>

</div>
</template>

<script>
import { mapState } from 'vuex'
import mobData from '../5e-SRD-Monsters.json'
import gameData from '../gameData.json'

export default {
  name: 'combat',
  created () {
    this.challengeRatingData = gameData.experience
  },
  data () {
    return {
      challengeRating: '',
      challengeRatingData: [],
      mobs: mobData.filter((mob) => { return ('name' in mob) }),
      alive: true,
      mobsAlive: false,
      rounds: 0,
      hasInitiative: false,
      opponents: [],
      combatLog: []
    }
  },
  methods: {
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

          let validActions = this.opponents[m].actions.filter((action) => { return ('damage_dice' in action) }) || []
          let selectedAction = validActions[ Math.floor(Math.random() * validActions.length) ]

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
      this.mobsAlive = this.opponents.filter((op) => { return op._hit_points > 0 }).length > 0

      // if hasInit player goes first, otherwise opponents go first
      if (this.hasInitiative) {
        this.pcAttack()

        this.mobsAlive = this.opponents.filter((op) => { return op._hit_points > 0 }).length > 0

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
      this.mobsAlive = this.opponents.filter((op) => { return op._hit_points > 0 }).length > 0

      // All opponents are dead and pc is alive
      if (!this.mobsAlive && this.alive) {
        this.combatLog.push('You have won!!!!')

        for (let i = 0; i < this.opponents.length; i++) {
          this.character.attr.xp += gameData.experience.filter((cr) => { return cr.challenge_rating === this.opponents[i].challenge_rating })[0].xp
        }

        this.$store.commit('SET_CHARACTER', this.character)
        this.saveCharacter(this.character)
      }

      // DED
      if (this.mobsAlive && !this.alive) {
        this.combatLog.push('You have died!!!!')
      }
    },
    modifier: function (value) {
      return Math.floor((parseInt(value) - 10) / 2)
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
        filteredMobs = this.mobs.filter((mob) => { return mob.challenge_rating === this.challengeRating })
      }

      // Not all monsters have damage rolls... this weeds out any bad data (i.e., Sprite)
      while (!isValid) {
        op = this.challengeRating.length ? filteredMobs[Math.floor(Math.random() * filteredMobs.length)] : this.mobs[ Math.floor(Math.random() * this.mobs.length) ]
        isValid = op.actions.filter((action) => { return ('damage_dice' in action) }).length > 0
      }

      this.opponents.push(op)

      // this.opponents.push(this.mobs.filter((mob) => { return mob.name === 'Sprite' })[0])

      for (let i = 0; i < this.opponents.length; i++) {
        this.opponents[i]._hit_points = this.opponents[i].hit_points
      }

      this.alive = true
      this.mobsAlive = true
    },
    roll: function (dice, critical = false) {
      let rolls = dice.split('+')
      let result = 0

      for (let r = 0; r < rolls.length; r++) {
        // critical roles should roll double ie 1d6 becomes 2d6
        let count = critical ? rolls[r].split('d')[0] * 2 : rolls[r].split('d')[0]
        let die = rolls[r].split('d')[1]
        for (let i = 0; i < count; i++) {
          result += Math.floor(Math.random() * die) + 1
        }
      }

      return parseInt(result)
    },
    saveCharacter: function () {
      localStorage.setItem('character', JSON.stringify(this.character))
      this.$store.dispatch('refreshCharacter')
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
    byLevel: function () {
      return gameData.advancement.filter((data) => { return data.level === this.character.attr.lvl })[0]
    },
    ...mapState(['character'])
  }
}
</script>

<style lang="scss" scoped>
.char {
 margin: 8px 12px;
}
</style>
