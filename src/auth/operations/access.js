const allOperations = ['create', 'read', 'update', 'delete'];

async function accessOperation(args) {
  const { config } = this;

  const {
    req,
    req: { user },
  } = args;

  const results = {};
  const promises = [];

  const isLoggedIn = !!(user);
  const userCollectionConfig = (user && user.collection) ? config.collections.find((collection) => collection.slug === user.collection) : null;

  const createAccessPromise = async (obj, access, operation, disableWhere = false) => {
    const updatedObj = obj;
    const result = await access({ req });

    if (typeof result === 'object' && !disableWhere) {
      updatedObj[operation] = {
        permission: true,
        where: result,
      };
    } else {
      updatedObj[operation] = {
        permission: !!(result),
      };
    }
  };

  const executeFieldPolicies = (obj, fields, operation) => {
    const updatedObj = obj;

    fields.forEach(async (field) => {
      if (field.name) {
        if (!updatedObj[field.name]) updatedObj[field.name] = {};

        if (field.access && typeof field.access[operation] === 'function') {
          promises.push(createAccessPromise(updatedObj[field.name], field.access[operation], operation, true));
        } else {
          updatedObj[field.name][operation] = {
            permission: isLoggedIn,
          };
        }

        if (field.type === 'relationship') {
          const relatedCollections = Array.isArray(field.relationTo) ? field.relationTo : [field.relationTo];

          relatedCollections.forEach((slug) => {
            const collection = config.collections.find((coll) => coll.slug === slug);

            if (collection && collection.access && collection.access[operation]) {
              promises.push(createAccessPromise(updatedObj[field.name], collection.access[operation], operation, true));
            }
          });
        }

        if (field.fields) {
          if (!updatedObj[field.name].fields) updatedObj[field.name].fields = {};
          executeFieldPolicies(updatedObj[field.name].fields, field.fields, operation);
        }
      } else if (field.fields) {
        executeFieldPolicies(updatedObj, field.fields, operation);
      }
    });
  };

  const executeEntityPolicies = (entity, operations) => {
    results[entity.slug] = {
      fields: {},
    };

    operations.forEach((operation) => {
      executeFieldPolicies(results[entity.slug].fields, entity.fields, operation);

      if (typeof entity.access[operation] === 'function') {
        promises.push(createAccessPromise(results[entity.slug], entity.access[operation], operation));
      } else {
        results[entity.slug][operation] = {
          permission: isLoggedIn,
        };
      }
    });
  };

  if (userCollectionConfig) {
    results.canAccessAdmin = userCollectionConfig.access.admin ? userCollectionConfig.access.admin(args) : isLoggedIn;
  } else {
    results.canAccessAdmin = false;
  }

  config.collections.forEach((collection) => {
    executeEntityPolicies(collection, allOperations);
  });

  config.globals.forEach((global) => {
    executeEntityPolicies(global, ['read', 'update']);
  });

  await Promise.all(promises);

  return results;
}

module.exports = accessOperation;