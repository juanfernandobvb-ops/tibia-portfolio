<template>
  <div>
    <input v-model="search" class="search-input" placeholder="Buscar item, monstro, NPC, preço..." />
    <table class="delivery-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Item</th>
          <th>Dropa de</th>
          <th>Vende Para</th>
          <th>Preço</th>
          <th>Quantidade aproximada</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredList" :key="item.item">
          <td><!-- Imagem futura --></td>
          <td>{{ item.item }}</td>
          <td>{{ item.dropaDe }}</td>
          <td>{{ item.vendePara }}</td>
          <td>{{ item.preco }}</td>
          <td>{{ item.quantidade }}</td>
        </tr>
      </tbody>
    </table>
    <div class="follow-msg">
      Gostou da planilha? Deixa o follow la na minha live pra me ajudar: <a href="https://twitch.tv/rellz_live" target="_blank">twitch.tv/rellz_live</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Delivery',
  data() {
    return {
      search: '',
      deliveryList: [
        { item: 'Afflicted Strider Head', dropaDe: 'Afflicted Strider', vendePara: 'Yasir', preco: '900gp', quantidade: '16-20' },
        { item: 'Afflicted Strider Worms', dropaDe: 'Afflicted Strider', vendePara: 'Yasir', preco: '500gp', quantidade: '32-43' },
        { item: 'Alloy Legs', dropaDe: 'Brachiodemon, Bulltaur Alchemist, Control Tower, Glooth Battery, Metal Gargoyle, Sorcerer\'s Apparition, Ghulosh, Katex Blood Tongue, Yirkas Blue Scales', vendePara: 'Outro', preco: '11 000gp', quantidade: '10-17' },
        { item: 'Amber Souvenir', dropaDe: 'Quara Looter, Quara Plunderer, Quara Raider', vendePara: 'Outro', preco: '850gp', quantidade: '40-42' },
        { item: 'Ancient Belt Buckle', dropaDe: 'Broken Shaper, Twisted Shaper', vendePara: 'Yasir', preco: '260gp', quantidade: '63-99' },
        { item: 'Ancient Stone', dropaDe: 'Animated Ogre Brute, Eternal Guardian, Museum Stone Golem, Ogre Brute, Stone Devourer, Stone Golem, Ancient Spawn of Morgathla, The Last Lore Keeper, The Source of Corruption', vendePara: 'Outro', preco: '200gp', quantidade: '105-192' },
        { item: 'Angelic Axe', dropaDe: 'Humongous Fungus, Lucifuga Aranea, Mutated Tiger, Weretiger, Feroxa, Weakened Shlorg', vendePara: 'Djinn', preco: '5 000gp', quantidade: '13-19' },
        { item: 'Badger Boots', dropaDe: 'Werebadger, Feroxa, Sharpclaw, The Baron from Below', vendePara: 'Outro', preco: '7 500gp', quantidade: '11-15' },
        { item: 'Banana Sash', dropaDe: 'Merlkin, Sibang', vendePara: 'Yasir', preco: '55gp', quantidade: '11-18' },
        { item: 'Basalt Crumbs', dropaDe: 'Darklight Emitter, Wandering Pillar', vendePara: 'Outro', preco: '3000gp', quantidade: '12-15' },
        { item: 'Basalt Fetish', dropaDe: 'Lost Basher, Lost Exile, Lost Husher, Lost Thrower', vendePara: 'Yasir', preco: '210gp', quantidade: '55-88' },
        { item: 'Basalt Figurine', dropaDe: 'Lost Basher, Lost Exile, Lost Husher, Lost Thrower', vendePara: 'Yasir', preco: '160gp', quantidade: '49-57' },
        { item: 'Bashmu Fang', dropaDe: 'Bashmu, Juvenile Bashmu', vendePara: 'Yasir', preco: '600gp', quantidade: '11-19' },
        { item: 'Bashmu Feather', dropaDe: 'Bashmu, Juvenile Bashmu', vendePara: 'Yasir', preco: '350gp', quantidade: '32-45' },
        { item: 'Bashmu Tongue', dropaDe: 'Bashmu, Juvenile Bashmu', vendePara: 'Yasir', preco: '400gp', quantidade: '25-50' },
        { item: 'Battle Shield', dropaDe: 'Animated Cyclops, Assassin, Cyclops, Cyclops Drone, Cyclops Smith, Demon Skeleton, Dwarf Guard, Elf Overseer, Frost Giant, Frost Giantess, Gargoyle, Hellspawn, Memory of a Dwarf, Memory of a Pirate, Minotaur Guard, Mutated Bat, Orc Rider, Pirate Buccaneer, Undead Minion, War Golem, Foreman Kneebiter, General Murius, The Horned Fox', vendePara: 'Outro', preco: '95gp', quantidade: '26-45' },
        { item: 'Black Shield', dropaDe: 'Animated Mummy, Candy Horror, Furious Scorpion, Gloom Maw, Lost Basher, Lost Berserker, Magma Crawler, Mummy, Mutated Bat, Priestess, Sandstone Scorpion, Thanatursus, Werehyaena Shaman, Wiggler, Bruise Payne', vendePara: 'Djinn', preco: '800gp', quantidade: '10-17' },
        { item: 'Blemished Spawn Abdomen', dropaDe: 'Blemished Spawn', vendePara: 'Yasir', preco: '550gp', quantidade: '66-74' },
        { item: 'Blemished Spawn Head', dropaDe: 'Blemished Spawn', vendePara: 'Yasir', preco: '800gp', quantidade: '32-41' },
        { item: 'Blemished Spawn Tail', dropaDe: 'Blemished Spawn', vendePara: 'Yasir', preco: '1 000gp', quantidade: '12-20' },
      ],
    };
  },
  computed: {
    filteredList() {
      if (!this.search) return this.deliveryList;
      const s = this.search.toLowerCase();
      return this.deliveryList.filter(item =>
        item.item.toLowerCase().includes(s) ||
        item.dropaDe.toLowerCase().includes(s) ||
        item.vendePara.toLowerCase().includes(s) ||
        item.preco.toLowerCase().includes(s) ||
        item.quantidade.toLowerCase().includes(s)
      );
    },
  },
};
</script>

<style scoped>
.delivery-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.delivery-table th, .delivery-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
  font-size: 0.95rem;
}
.delivery-table th {
  background: #f5f5f5;
}
.search-input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.follow-msg {
  margin-top: 1rem;
  font-size: 1.1rem;
}
.follow-msg a {
  color: #6441a5;
  text-decoration: underline;
}
</style>
