const { GraphQLNonNull } = require('graphql');
const formatName = require('../../graphql/utilities/formatName');

const {
  findOne, upsert,
} = require('./resolvers');

function registerGlobals() {
  Object.keys(this.globals.config).forEach((slug) => {
    const global = this.globals.config[slug];
    const {
      label,
      fields,
    } = global;

    const formattedLabel = formatName(label);

    global.graphQL = {};

    global.graphQL.type = this.buildObjectType(
      formattedLabel,
      fields,
      formattedLabel,
    );

    global.graphQL.mutationInputType = new GraphQLNonNull(this.buildMutationInputType(
      formattedLabel,
      fields,
      formattedLabel,
    ));

    this.Query.fields[formattedLabel] = {
      type: global.graphQL.type,
      args: {
        locale: { type: this.types.localeInputType },
        fallbackLocale: { type: this.types.fallbackLocaleInputType },
      },
      resolve: findOne(this.globals.Model, global),
    };

    this.Mutation.fields[`upsert${formattedLabel}`] = {
      type: global.graphQL.type,
      args: {
        data: { type: global.graphQL.mutationInputType },
      },
      resolve: upsert(this.globals.Model, global),
    };
  });
}

module.exports = registerGlobals;