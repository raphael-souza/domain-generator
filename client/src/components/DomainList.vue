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
              v-on:deleteItem="deletePrefix"
            ></appItemList>
          </div>

          <div class="col-md">
            <appItemList
              title="Sufixos"
              v-bind:items="items.sufix"
              v-on:addItem="addItem"
              type="sufix"
              v-on:deleteItem="deleteSufix"
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
                  <div class="col-md">{{domain.name}}</div>
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
      }
    };
  },
  methods: {
    addPrefix(prefix) {
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
            item: {
              type: "prefix",
              description: prefix
            }
          }
        }
      }).then( response => {
        const query = response.data;
        const newPrefix = query.data.newPrefix;
        this.items.prefix.push(newPrefix.description);
      });
    },
    addSufix(sufix) {
      this.items.sufix.push(sufix);
    },
    generate() {
      this.domains = [];
      for (const prefix of this.items.prefix) {
        for (const sufix of this.items.sufix) {
          this.domains.push(prefix + " " + sufix);
        }
      }
    },
    deletePrefix(prefix) {
      axios ({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation ($id: Int) {
              deleteItem(id: $id)
            }
          `,
          variables: {
            id: prefix.id
          }
        }
      }).then(() =>
        this.getItems("prefix")
      )
    },
    deleteSufix(sufix) {
      this.items.sufix.splice(this.items.sufix.indexOf(sufix), 1);
    },
    getItems(type) {
      axios({
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
   
  },
  computed: {
    domains() {
      console.log("generating domains...");
      const domains = [];
      for (const prefix of this.items.prefix) {
        for (const sufix of this.items.sufix) {
          const name = prefix.description + sufix.description;
          const url = name.toLowerCase();
          const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com`;
          domains.push({
            name,
            checkout
          });
        }
      }
      return domains;
    }
  },
  created() {
    this.getItems('prefix');
    this.getItems('sufix');
  }
};
</script>

<style>
</style>
