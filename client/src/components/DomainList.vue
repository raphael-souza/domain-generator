<template>
  <div>
    <div id="main">
      <div class="container">
        <div class="row">
          <div class="col-md">
            <appItemList
              title="Prefixos"
              v-bind:items="items.prefix"
              v-on:addItem="addItem"
              type="prefix"
              v-on:deleteItem="deleteItem"
            ></appItemList>
          </div>

          <div class="col-md">
            <appItemList
              title="Sufixos"
              v-bind:items="items.sufix"
              v-on:addItem="addItem"
              type="sufix"
              v-on:deleteItem="deleteItem"
            ></appItemList>
          </div>
        </div>

        <br />
        <h5>
          Domínios
          <span class="bagde badge-info">{{domains.length}}</span>
        </h5>
        <div class="card">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item" v-for="domain in domains" v-bind:key="domain.name">
                <div class="row">
                  <div class="col-md-6">
                    {{domain.name}}
                  </div>
                  <div class="col-md-3">
                    <span class="badge badge-info">{{ domain.available ? "Disponível" : "Não disponível" }}</span>
                  </div>

                  <div class="col-md text-right">
                    <router-link class="btn btn-info" :to="`'/domains/'${domain.name}`">
                      <span class="fa fa-search"></span>
                    </router-link>
                  </div>

                  <div class="col-md text-right">
                    <a class="btn btn-info" v-bind:href="domain.checkout" target="_black">
                      <span class="fa fa-shopping-cart"></span>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AppItemList from "./AppItemList";

export default {
  name: "DomainList",
  components: {
    AppItemList
  },
  data: function() {
    return {}
  },
  methods: {

    // addItem(item) {
    //   this.$store.dispatch("addItem", item);
    // },
    // deleteItem(item) {
    //   this.$store.dispatch("deleteItem", item);
    // },
    // getItems(type) {
    //   this.$store.dispatch("getItems", type);
      
    // },
    // generateDomains() {
    //   this.$store.dispatch("generateDomains"); 
    // }
    ...mapActions(["addItem", "deleteItem", "getItems", "generateDomains"]),

    generate() {
        this.domains = [];
        for (const prefix of this.items.prefix) {
          for (const sufix of this.items.sufix) {
            this.domains.push(prefix + " " + sufix);
          }
        }
      },
  },
  computed: {
    // items() {
    //   return this.$store.state.items;
    // },
    // domains() {
    //   return this.$store.state.domains;
    // }

    ...mapState(["items", "domains"])
  },
 
  created() {
  //   Promise.all ([
  //   this.getItems('prefix'),
  //   this.getItems('sufix')
  //   ]).then(() => {
  //     this.generateDomains();
  //   });
  }
};
</script>

<style>
</style>
