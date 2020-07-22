const path = require('path');
const Admin = require('./collections/Admin');
const AllFields = require('./collections/AllFields');
const Code = require('./collections/Code');
const Conditions = require('./collections/Conditions');
const CustomComponents = require('./collections/CustomComponents');
const File = require('./collections/File');
const Blocks = require('./collections/Blocks');
const HiddenFields = require('./collections/HiddenFields');
const Hooks = require('./collections/Hooks');
const Localized = require('./collections/Localized');
const LocalizedArray = require('./collections/LocalizedArray');
const Media = require('./collections/Media');
const NestedArrays = require('./collections/NestedArrays');
const Preview = require('./collections/Preview');
const PublicUsers = require('./collections/PublicUsers');
const RelationshipA = require('./collections/RelationshipA');
const RelationshipB = require('./collections/RelationshipB');
const RichText = require('./collections/RichText');
const StrictPolicies = require('./collections/StrictPolicies');
const Validations = require('./collections/Validations');

const BlocksGlobal = require('./globals/BlocksGlobal');
const NavigationArray = require('./globals/NavigationArray');
const GlobalWithStrictAccess = require('./globals/GlobalWithStrictAccess');

module.exports = {
  admin: {
    user: 'admins',
    disable: false,
    components: {
      layout: {
        // Sidebar: path.resolve(__dirname, 'client/components/layout/Sidebar/index.js'),
      },
    },
  },
  collections: [
    Admin,
    AllFields,
    Code,
    Conditions,
    CustomComponents,
    File,
    Blocks,
    HiddenFields,
    Hooks,
    Localized,
    LocalizedArray,
    Media,
    NestedArrays,
    Preview,
    PublicUsers,
    RelationshipA,
    RelationshipB,
    RichText,
    StrictPolicies,
    Validations,
  ],
  globals: [
    NavigationArray,
    GlobalWithStrictAccess,
    BlocksGlobal,
  ],
  cookiePrefix: 'payload',
  serverURL: 'http://localhost:3000',
  cors: ['http://localhost', 'http://localhost:8080', 'http://localhost:8081'],
  routes: {
    api: '/api',
    admin: '/admin',
    graphQL: '/graphql',
    graphQLPlayground: '/graphql-playground',
  },
  defaultDepth: 2,
  compression: {},
  paths: {
    scss: path.resolve(__dirname, 'client/scss/overrides.scss'),
  },
  graphQL: {
    mutations: {},
    queries: {},
  },
  localization: {
    locales: [
      'en',
      'es',
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  productionGraphQLPlayground: false,
  hooks: {
    afterError: () => {
      console.error('global error config handler');
    },
  },
  webpack: (config) => config,
};