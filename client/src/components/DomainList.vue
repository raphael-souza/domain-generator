<template>
  <div>
    <div id="main">
      <div class="container">
        <div class="row">

          <div class="col-md">
            <appItemList title="Prefixos" v-bind:items="prefixes" v-on:addItem="addPrefix" v-on:deleteItem="deletePrefix"></appItemList>
          </div>

          <div class="col-md">
            <appItemList title="Sufixos" v-bind:items="sufixes" v-on:addItem="addSufix" v-on:deleteItem="deleteSufix"></appItemList>

          </div>
        </div>

        <br/>
        <h5>
          Domínios
          <span class="bagde badge-info">{{domains.length}}</span>
        </h5>
        <div class="card">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item" v-for="domain in domains" v-bind:key="domain.name">
                <div class="row">
                  <div class="col-md ">
                    {{domain.name}}
                  </div>
                  <div class="col-md text-right">
                    <a class="btn btn-info" v-bind:href="domain.checkout" target="_black"><span class="fa fa-shopping-cart"></span></a>
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
      prefixes: [],
      sufixes: [],
    };
  },
  methods: {
    addPrefix(prefix) {
      //this.prefixes.push(prefix);
      axios({
        url: "http://localhost:4000",
        method: "post",
        data: {
          query: `
            mutation ($item: ItemInput) {
              saveItem(item: $item) {
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
      })
    },
    addSufix(sufix) {
      this.sufixes.push(sufix);
    },
    generate() {
      this.domains = [];
      for (const prefix of this.prefixes) {
        for (const sufix of this.sufixes) {
          this.domains.push(prefix + ' ' + sufix);
        }
      }
    },
    deletePrefix(prefix) {
      this.prefixes.splice(this.prefixes.indexOf(prefix), 1);      
    },
    deleteSufix(sufix) {
      this.sufixes.splice(this.sufixes.indexOf(sufix), 1);      
    }
  },
  computed: {
    domains() {
      console.log("generating domains...");
      const domains = [];
      for (const prefix of this.prefixes) {
        for (const sufix of this.sufixes) {
          const name = prefix + sufix;
          const url = name.toLowerCase();
          const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com`
          domains.push({
            name,
            checkout
          });
        }
      }
      return domains;
    },
  },
  created() {
    axios({
      url: "http://localhost:4000",
      method: "post",
      data: {
        query: `
          {
            prefixes: items (type: "prefix") {
              id
              type
              description
            }
            sufixes: items (type: "sufix") {
              description
            }
          }
        `
      }
    }).then(response => {
      const query = response.data;
      this.prefixes = query.data.prefixes.map(prefix => prefix.description);
      this.sufixes = query.data.sufixes.map(sufix => sufix.description);
      console.log(query.data);
    });
  },
 
};
</script>

<style>

</style>
