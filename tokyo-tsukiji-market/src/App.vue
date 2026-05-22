<script setup lang="ts">
import { computed, ref } from 'vue'
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'

enum ResourceType {
  MACKEREL = 'Mackerel',
  SQUID = 'squid',
  EEL = 'eel',
  SALMON = 'salmon',
  RED_SNAPPER = 'red-snapper',
}

enum ShipState {
  DOCKING = 'docking',
  FISHING = 'fishing',
  UNDOCKING = 'undocking',
}

type Ship = {
  id: number
  size: number
  barrels: Resource[]
  state: ShipState
}

type Resource = {
  type: ResourceType
  price: number
}

type Player = {
  id: number
  money: number
  barrels: Resource[]
  ships: Ship[]
  actions: number
  licenses: ResourceType[]
}

type Market = {
  id: number
  type: ResourceType
  barrels: number
  fish: number
  actions: number
}

const round = ref(1)

const player1 = ref(<Player>{
  id: 1,
  money: 2000,
  barrels: [],
  ships: [{ id: 1, size: 1, barrels: [], state: ShipState.DOCKING }],
  actions: 2,
  licenses: [ResourceType.MACKEREL],
})

const marketMackerel = ref(<Market>{
  id: 1,
  type: ResourceType.MACKEREL,
  barrels: 15,
  fish: 15,
  actions: 1,
})

const markets = computed((): Market[] => {
  return [marketMackerel.value]
})

const players = computed((): Player[] => {
  return [player1.value]
})

const onShipStateClick = (playerId: number, shipId: number, updatedState: ShipState): void => {
  const currentPlayer = players.value.find((player: Player) => {
    return player.id === playerId
  })

  const currentShip = currentPlayer?.ships.find((ship: Ship) => {
    return ship.id === shipId
  })

  if (!!currentShip && !!currentPlayer) {
    currentShip.state = updatedState
    currentPlayer.actions--
  }
}

const onContinueClick = (): void => {
  round.value++
  player1.value.actions = 2
}

const isFishingDisabled = (player: Player, market: Market): boolean => {
  // console.log('player.actions', player.actions)
  // console.log('market.actions', market.actions)
  // console.log('player.licenses.includes(market.type)', player.licenses.includes(market.type))
  // console.log(
  //   'player.ships.find((ship: Ship) => { return ship.state === ShipState.UNDOCKING })',
  //   player.ships.find((ship: Ship) => {
  //     return ship.state === ShipState.UNDOCKING
  //   }),
  // )

  const validLicenses = player.ships.filter((ship: Ship) => {
    return player.licenses.includes(market.type) && ship.state === ShipState.UNDOCKING
  })

  const hasEnoughActions = player.actions >= market.actions

  console.log('validLicenses', validLicenses.length)
  console.log('hasEnoughActions', hasEnoughActions)

  return !(hasEnoughActions && validLicenses.length)
}

const onFishing = (player: Player, market: Market): void => {
  const currentPlayer = players.value.find((_player: Player) => {
    return _player.id === player.id
  })

  const currentMarket = markets.value.find((_market: Market) => {
    return _market.id === market.id
  })

  if (!!currentPlayer && !!currentMarket) {
    currentPlayer.actions--
    currentMarket.barrels--
    currentPlayer.barrels.push({ type: market.type, price: 0 })
  }
}
</script>

<template>
  <!-- 
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
   -->

  <div>
    <div>
      <h1 v-text="'Tokoy Tsukiji Market'" />
      <p v-text="`Round: ${round}`" />

      <h2 v-text="`Player-${player1.id}`" />
      {{ player1 }}

      <div class="ship" v-for="ship in player1.ships" :key="ship.id">
        <h3 v-text="`Ship-${ship.id}`" />
        <p>State: {{ ship.state }}</p>
        <p>Barrels: {{ ship.barrels }} ({{ ship.barrels.length }})</p>
        <div>
          <button
            :disabled="player1.actions <= 0 || ship.state === ShipState.UNDOCKING"
            @click="onShipStateClick(player1.id, ship.id, ShipState.UNDOCKING)"
          >
            undock
          </button>
          <button
            :disabled="player1.actions <= 0 || ship.state === ShipState.DOCKING"
            @click="onShipStateClick(player1.id, ship.id, ShipState.DOCKING)"
          >
            dock
          </button>
        </div>
      </div>

      <div class="market" v-for="market in markets" :key="market.id">
        <h3 v-text="`Market-${market.id}: ${market.type}`" />
        <p>Barrels: {{ market.barrels }}</p>
        <p>Fish: {{ market.fish }}</p>
        <p>Actions: {{ market.actions }}</p>

        <div>
          <button
            :disabled="isFishingDisabled(player1, market)"
            @click="onFishing(player1, market)"
          >
            fish
          </button>
        </div>
      </div>

      <div class="navbar">
        <button @click="onContinueClick">CONTINUE</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ship {
  margin-top: 24px;
}

.navbar {
  margin-top: 24px;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
