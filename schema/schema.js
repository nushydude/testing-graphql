const graphql = require('graphql');
// const _ = require('lodash');
const axios = require('axios');

const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = graphql;


// CompanyType has to be defined before UserType because
// CompanyType is used inside the definition of the UserType.
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User', // required
  fields: { // required
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    company: { // note that this is company and not companyId :S
      type: CompanyType,
      resolve(parentValue, args) {
        // this function is required to map between the companyId and company.
        // if you console.log parentValue and args, you will find that the
        // parentValue contains the user
        return (
          axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data)
        );
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return (
          axios.get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data) // we need this because axios returns the data inside res.data
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
