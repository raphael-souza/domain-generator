<template>
  <div>
    <div class="text-center">
      <h1>NameGator</h1>
      <br />
      <h6 class="text-secondary">Gerador de nomes utilizando Vue.js, GraphQL e Node.js</h6>
    </div>

    <div id="main">
      <div class="container">
        <div class="row">
          <div class="col-md">
            <h5>
              Prefixos
              <span class="bagde badge-info">{{prefixes.length}}</span>
            </h5>
            <div class="card">
              <div class="card-body">
                <ul class="list-group">
                  <li class="list-group-item" v-for="prefix in prefixes" v-bind:key="prefix">
                    <div class="row">
                      <div class="col-md">
                        {{prefix}}
                      </div>
                      <div class="col-md text-right">
                        <button class="btn btn-info" v-on:click="deletePrefix(prefix)"><span class="fa fa-trash"></span></button>
                      </div>
                    </div>  
                  </li>
                </ul>

                <br/>
                <div class="input-group">
                  <input type="text" class="form-controll" v-model="prefix" v-on:keyup.enter="addPrefix(prefix)" placeholder="Digite o prefixo" />
                  <div class="input-group-append">
                    <button class="btn btn-info" v-on:click="addPrefix(prefix)">
                      <span class="fa fa-plus"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md">
            <h5>
              Sufixos
              <span class="bagde badge-info">{{sufixes.length}}</span>
            </h5>
            <div class="card">
              <div class="card-body">
                <ul class="list-group">
                  <li class="list-group-item" v-for="sufix in sufixes" v-bind:key="sufix">
                    <div class="row">
                      <div class="col-md">
                        {{sufix}}
                      </div>
                      <div class="col-md text-right">
                        <button class="btn btn-info" v-on:click="deleteSufix(prefix)"><span class="fa fa-trash"></span></button>
                      </div>
                    </div> 
                  </li>
                </ul>
                <br />
                <div class="input-group">
                  <input type="text" class="form-controll" v-model="sufix" v-on:keyup.enter="addSufix(sufix)" placeholder="Digite o sufixo" />
                  <div class="input-group-append">
                    <button class="btn btn-info" v-on:click="addSufix(sufix)">
                      <span class="fa fa-plus"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
export default {
  name: "App",
  components: {},
  data: function() {
    return {
      prefix:"",
      sufix: "",
      prefixes: ["Air", "Jet", "Fligth"],
      sufixes: ["Hub", "Station", "Mart"],
      // domains: [
      //   "Air Hub",
      //   "AirStation",
      //   "AirMart",
      //   "Jet Hub",
      //   "Jet Station",
      //   "Jet Mart",
      //   "Figth Hub",
      //   "Fligth Station",
      //   "Fligth Mart"
      // ]
    };
  },
  methods: {
    addPrefix(prefix) {
      this.prefixes.push(prefix);
      this.prefix = "";      
    },
    addSufix(sufix) {
      this.sufixes.push(sufix);
      this.sufix = "";      
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
    }
  }
 
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
