'use strict';
var docgen = require('react-docgen');
var recast = require('recast');
var doctrine = require('doctrine');

function stylePropTypeHandler(documentation, path) {
  var propTypesPath = docgen.utils.getMemberValuePath(path, 'propTypes');
  if (!propTypesPath) {
    return;
  }

  propTypesPath = docgen.utils.resolveToValue(propTypesPath);
  if (!propTypesPath || propTypesPath.node.type !== 'ObjectExpression') {
    return;
  }

  // Check if the there is a style prop
  propTypesPath.get('properties').each(function(propertyPath) {
    if (propertyPath.node.type !== 'Property' ||
        docgen.utils.getPropertyName(propertyPath) !== 'style') {
      return;
    }
    var valuePath = docgen.utils.resolveToValue(propertyPath.get('value'));
    // If it's a call to StyleSheetPropType, do stuff
    if (valuePath.node.type !== 'CallExpression' ||
        valuePath.node.callee.name !== 'StyleSheetPropType') {
      return;
    }
    // Get type of style sheet
    var styleSheetModule = docgen.utils.resolveToModule(
      valuePath.get('arguments', 0)
    );
    if (styleSheetModule) {
      var propDescriptor = documentation.getPropDescriptor('style');
      propDescriptor.type = {name: 'stylesheet', value: styleSheetModule};
    }
  });
}

function deprecatedPropTypeHandler(documentation, path) {
  var propTypesPath = docgen.utils.getMemberValuePath(path, 'propTypes');
  if (!propTypesPath) {
    return;
  }

  propTypesPath = docgen.utils.resolveToValue(propTypesPath);
  if (!propTypesPath || propTypesPath.node.type !== 'ObjectExpression') {
    return;
  }

  // Checks for deprecatedPropType function and add deprecation info.
  propTypesPath.get('properties').each(function(propertyPath) {
    var valuePath = docgen.utils.resolveToValue(propertyPath.get('value'));
    // If it's a call to deprecatedPropType, do stuff
    if (valuePath.node.type !== 'CallExpression' ||
        valuePath.node.callee.name !== 'deprecatedPropType') {
      return;
    }
    var propDescriptor = documentation.getPropDescriptor(
      docgen.utils.getPropertyName(propertyPath)
    );
    // The 2nd argument of deprecatedPropType is the deprecation message.
    // Used printValue to get the string otherwise there was issues with template
    // strings.
    propDescriptor.deprecationMessage = docgen.utils
      .printValue(valuePath.get('arguments', 1))
      // Remove the quotes printValue adds.
      .slice(1, -1);

    // Get the actual prop type.
    propDescriptor.type = docgen.utils.getPropType(
      valuePath.get('arguments', 0)
    );
  });
}

const reactMethods = [
  'render',
  'getInitialState',
  'getDefaultProps',
  'getChildContext',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
];

const types = recast.types.namedTypes;

function methodsHandler(documentation, path) {
  // Extract all methods from the class or object.
  let methodPaths;
  if (docgen.utils.isReactComponentClass(path)) {
    methodPaths = path
      .get('body', 'body')
      .filter(p => types.MethodDefinition.check(p.node) && p.node.kind !== 'constructor');
  } else {
    let properties = path.get('properties');

    // Add the statics object properties.
    const statics = docgen.utils.getMemberValuePath(path, 'statics');
    if (statics) {
      properties = properties.map(p => p).concat(statics.get('properties').map(p => p));
    }

    methodPaths = properties.filter(p => types.FunctionExpression.check(p.get('value').node));
  }

  if (!methodPaths) {
    return;
  }

  const methods = extractMethods(methodPaths);
  documentation.set('methods', methods);
}

function extractMethods(propertiesPath) {
  const methods = [];

  propertiesPath.forEach((propPath) => {
    const name = docgen.utils.getPropertyName(propPath);
    if (reactMethods.indexOf(name) !== -1) {
      return;
    }

    const functionExpression = propPath.get('value');
    const docBlock = docgen.utils.docblock.getDocblock(propPath);
    const jsDocs = docBlock && parseJsDocBlock(docBlock);

    methods.push({
      name: name,
      description: jsDocs && jsDocs.description,
      modifiers: getMethodModifiers(propPath),
      params: getMethodParamsDoc(functionExpression, jsDocs),
      return: getMethodReturnDoc(functionExpression, jsDocs),
    });
  });

  return methods;
}

function getMethodParamsDoc(functionPath, jsDocs) {
  const params = [];

  // Extract param flow types.
  functionPath.get('params').each(paramPath => {
    const param = {
      name: paramPath.node.name,
    };
    const typePath = docgen.utils.getTypeAnnotation(paramPath);
    if (typePath) {
      const type = docgen.utils.getFlowType(typePath);
      param.typehint = type.name;
    }

    params.push(param);
  });

  // Add jsdoc @param descriptions.
  if (jsDocs) {
    jsDocs.tags
      .filter(tag => tag.title === 'param')
      .forEach(tag => {
        const param = params.find(p => p.name === tag.name);
        if (param) {
          param.description = tag.description;
        }
      });
  }

  return params;
}

function getMethodReturnDoc(functionPath, jsDocs) {
  let type;
  let description;

  // Extract flow return type.
  if (functionPath.node.returnType) {
    const returnType = docgen.utils.getTypeAnnotation(functionPath.get('returnType'));
    type = docgen.utils.getFlowType(returnType);
  }

  // Add jsdoc @return description.
  if (jsDocs) {
    const returnTag = jsDocs.tags.find(tag => tag.title === 'return');
    if (returnTag) {
      description = returnTag.description;
    }
  }

  if (type || description) {
    return {
      type,
      description,
    };
  }
  return null;
}

function getMethodModifiers(methodPath) {
  const modifiers = [];

  if (types.MethodDefinition.check(methodPath.node) && methodPath.node.static) {
    modifiers.push('static');
  } else {
    const parent = findParentProperty(methodPath, 'statics');
    if (parent) {
      modifiers.push('static');
    }
  }

  const functionExpression = methodPath.get('value').node;
  if (functionExpression.generator) {
    modifiers.push('generator');
  }
  if (functionExpression.async) {
    modifiers.push('async');
  }

  return modifiers;
}

function findParentProperty(path, name) {
  let curPath = path;
  while (curPath) {
    if (types.Property.check(curPath.node) && docgen.utils.getPropertyName(curPath) === name) {
      return curPath;
    }
    curPath = curPath.parentPath;
  }
  return null;
}

function parseJsDocBlock(docBlock) {
  return doctrine.parse(docBlock);
}

function findExportedOrFirst(node, recast) {
  return docgen.resolver.findExportedComponentDefinition(node, recast) ||
    docgen.resolver.findAllComponentDefinitions(node, recast)[0];
}

function findExportedObject(ast, recast) {
  var objPath;
  recast.visit(ast, {
    visitAssignmentExpression: function(path) {
      if (!objPath && docgen.utils.isExportsOrModuleAssignment(path)) {
        objPath = docgen.utils.resolveToValue(path.get('right'));
      }
      return false;
    }
  });

  if (objPath) {
    // Hack: This is easier than replicating the default propType
    // handler.
    // This converts any expression, e.g. `foo` to an object expression of
    // the form `{propTypes: foo}`
    var b = recast.types.builders;
    var nt = recast.types.namedTypes;
    var obj = objPath.node;

    // Hack: This is converting calls like
    //
    //    Object.apply(Object.create(foo), { bar: 42 })
    //
    // to an AST representing an object literal:
    //
    //    { ...foo, bar: 42 }
    if (nt.CallExpression.check(obj) &&
        recast.print(obj.callee).code === 'Object.assign') {
      obj = objPath.node.arguments[1];
      var firstArg = objPath.node.arguments[0];
      if (recast.print(firstArg.callee).code === 'Object.create') {
        firstArg = firstArg.arguments[0];
      }
      obj.properties.unshift(
        b.spreadProperty(firstArg)
      );
    }

    objPath.replace(b.objectExpression([
      b.property('init', b.literal('propTypes'), obj)
    ]));
  }
  return objPath;
}

exports.stylePropTypeHandler = stylePropTypeHandler;
exports.deprecatedPropTypeHandler = deprecatedPropTypeHandler;
exports.methodsHandler = methodsHandler;
exports.findExportedOrFirst = findExportedOrFirst;
exports.findExportedObject = findExportedObject;
