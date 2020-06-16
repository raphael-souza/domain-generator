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
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import AppItemList from "./AppItemList";
import axios from "axios/dist/axios";

export default {
  name: "DomainList",
  components: {
    AppItemList
  },
  data: function() {
    return {
      items: {
        prefix: [],
        sufix: []
      },
      domains: []
    };
  },
  methods: {
    addItem(item) {
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation ($item: ItemInput) {
              newItem: saveItem(item: $item) {
                id
                type
                description
              }
            }
          `,
          variables: {
            item
          }
        }
      }).then( response => {
        const query = response.data;
        const newItem = query.data.newItem;
        this.items[item.type].push(newItem);
        this.generateDomains();
      });
    },
    generate() {
      this.domains = [];
      for (const prefix of this.items.prefix) {
        for (const sufix of this.items.sufix) {
          this.domains.push(prefix + " " + sufix);
        }
      }
    },
    deleteItem(item) {
      axios ({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation ($id: Int) {
              seleted: deleteItem(id: $id)
            }
          `,
          variables: {
            id: item.id
          }
        }
      }).then(() => {
        this.items[item.type].splice(this.items[item.type].indexOf(item), 1);
        this.generateDomains();
        
      });
    },
    getItems(type) {
      return axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            query ($type: String) {
              items: items (type: $type) {
                id
                type
                description
              }
            }
        `,
        variables: {
          type
        }
        }
      }).then(response => {
        const query = response.data;
        this.items[type] = query.data.items;
        console.log(query.data);
      });
    },
    generateDomains() {
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation {
              domains: generateDomains {
                name
                checkout
                available
              }
            }
          `
        }
      }).then((response) => {
        const query = response.data;
        this.domains = query.data.domains;
      });
    }
   
  },
 
  created() {
    Promise.all ([
    this.getItems('prefix'),
    this.getItems('sufix')
    ]).then(() => {
      this.generateDomains();
    });
  }
};
</script>

<style>
</style>
