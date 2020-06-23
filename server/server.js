const { ApolloServer } = require("apollo-server");
const dns = require("dns");
const { domain } = require("process");
const service = require("./service");

const typeDefs = `
  type Item {
    id: Int
    type: String
    description: String
  }

  type Domain {
    name: String,
    extention: String
    checkout: String
    available: Boolean
  }

  type Query {
    items (type: String): [Item]
  }

  input ItemInput {
    type: String
    description: String
  }

  type Mutation {
    saveItem(item: ItemInput): Item
    deleteItem(id: Int): Boolean
    generateDomains(name: String): [Domain]
    generateDomain(name: String): [Domain]

  }
`;
const items = [];

const isDomainAvailable = function (url) {
  return new Promise(function (resolve, reject) {
    dns.resolve(url, function(error) {
      if (error) {
        resolve(true);
      } else {
        resolve(false);
      }
    });    
  });
}

const resolvers = {
  Query: {
    async items(_, args) {
      const items = await service.getItemsByType(args.type);
      return items
    }
  },
  Mutation: {
    async saveItem(_, args) {
      const item = args.item;
      const [newItem] = await service.saveItem(item);
      return newItem;
    },
    async deleteItem(_,args) {
      const id = args.id;
      await service.deleteItem(id);
      return true
    },
    async generateDomains() {
      console.log("generating domains...");
      const domains = [];

      const items = await service.getItems();

      for (const prefix of items.filter(item => item.type === "prefix")) {
        for (const sufix of items.filter(item => item.type === "sufix")) {
          const name = prefix.description + sufix.description;
          const url = name.toLowerCase();
          const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}`;
          const available = await isDomainAvailable(`${url}.com.br`);
          domains.push({
            name,
            checkout,
            available
          });
        }
      }

      return domains;
    },
    async generateDomain(_, args) {
      const name = args.name;
      const extentions = [".com.br", ".com", ".net", ".org"];
      const domains = [];

      for (const extention of extentions) {
        const url = name.toLowerCase();
        const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&ld=${extention}`;
        const available = await isDomainAvailable(`${url}${extention}`);
        domains.push({
          name,
          extention,
          checkout,
          available
        });
      }

      return domains;
    }
  }
}
console.log("server is online!");
const server = new ApolloServer({typeDefs, resolvers});
server.listen();