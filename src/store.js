import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    character: localStorage.getItem('character') ? JSON.parse(localStorage.getItem('character')) : {
      name: 'Thor',
      init: false,
      current: {
        hp: 0
      },
      attr: {
        lvl: 0,
        xp: 0,
        hp: 8,
        ac: 14
      },
      stats: {
        str: 1,
        dex: 1,
        con: 1,
        int: 1,
        wis: 1,
        chr: 1
      }
    },
    monsters: [
      {
        name: 'Bandit',
        attr: {
          ac: 12,
          hp: 11,
          _hp: 11,
          challenge: '1/8',
          xp: 25
        },
        stats: {
          str: 11,
          dex: 12,
          con: 12,
          int: 10,
          wis: 10,
          cha: 10
        },
        weapons: [{
          name: 'Scimitar',
          hitBonus: 3,
          dmg: '1d6',
          dmgBonus: 1
        }]
      },
      {
        name: 'Skeleton',
        attr: {
          ac: 13,
          hp: 13,
          _hp: 13,
          challenge: '1/4',
          xp: 50
        },
        stats: {
          str: 10,
          dex: 14,
          con: 15,
          int: 6,
          wis: 8,
          cha: 5
        },
        weapons: [{
          name: 'Shortsword',
          hitBonus: 4,
          dmg: '1d6',
          dmgBonus: 2
        }]
      }
    ],
    data: {
      classes: [
        { name: 'Warrior', base: 12, perLvl: 7 }
      ],
      races: [
        {
          name: 'Human',
          attr: { str: 1, dex: 1, con: 1, int: 1, wis: 1, chr: 1 }
        }
      ]
    }
  },
  mutations: {
    SET_CHARACTER (state, character) {
      state.character = character || null
    },
    SET_ATTR (state, attr) {
      state.character.attr = attr || null
    }
  },
  actions: {
    setCharacter ({ commit }, character) {
      commit('SET_CHARACTER', character)
    },
    setAttr ({ commit }, attr) {
      commit('SET_ATTR', attr)
    },
    async refreshCharacter (ctx) {
      ctx.commit('SET_CHARACTER', JSON.parse(localStorage.getItem('character')))
    }
  }
})
