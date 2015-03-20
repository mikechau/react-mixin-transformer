var r = {
  createClass: {
    type: 'VariableDeclarator',
    init: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          name: 'React'
        },
        property: {
          type: 'Identifier',
          name: 'createClass'
        }
      }
    }
  },
  mixins: {
    type: 'Property',
    value: {
      type: 'ArrayExpression'
    },
    key: {
      type: 'Identifier',
      name: 'mixins'
    },
    kind: 'init',
    method: false,
    shorthand: false,
    computed: false
  }
};

function checkReactCreateClass(obj) {
  if ((obj.type === r.createClass.type) &&
      (obj.init) &&
      (obj.init.type === r.createClass.init.type) &&
      (obj.init.callee) &&
      (obj.init.callee.type === r.createClass.init.callee.type) &&
      (obj.init.callee.object) &&
      (obj.init.callee.object.name === r.createClass.init.callee.object.name) &&
      (obj.init.callee.property) &&
      (obj.init.callee.property.name === r.createClass.init.callee.property.name)
  ) {
    if (this.debug) {
      console.log("\n\nReact Component: " + obj.id.name);
    }
    return true;
  } else {
    return false;
  }
}

function checkForReactMixinAttrs(obj) {
  if ((obj.type === r.mixins.type) &&
      (obj.value) &&
      (obj.value.type === r.mixins.value.type) &&
      (obj.key) &&
      (obj.key.name === r.mixins.key.name) &&
      (obj.kind === r.mixins.kind) &&
      (obj.method === r.mixins.method) &&
      (obj.shorthand === r.mixins.shorthand) &&
      (obj.computed === r.mixins.computed)
  ) {
    return true;
  } else {
    return false;
  }
}

function checkObjectExpression(obj) {
  if (obj.type === 'ObjectExpression') {
    return true;
  } else {
    return false;
  }
}

function buildReactMixinElement(mixin) {
  return {
    type: 'Identifier',
    name: mixin
  };
}

var ReactMixinTransformer = {
  inject: function(mixins, debug) {
    this.mixins = mixins;
    this.debug = debug || false;

    var self = this;

    return {
      type: 'replace',
      enter: function(node, parent) {
        self._injectReactMixins(node);
      }
    };
  },

  _injectReactMixins: function(node) {
    if (node.type === 'VariableDeclaration') {
      node
        .declarations
        .filter(checkReactCreateClass, this)
        .forEach(this._iterateOverArgs, this);
    }
  },

  _iterateOverArgs: function(declaration) {
    var args = declaration.init.arguments;

    args
      .filter(checkObjectExpression)
      .forEach(this._iterateOverProperties, this);
  },

  _iterateOverProperties: function(arg) {
    var properties = arg.properties;
    var reactMixinProperties = properties.filter(checkForReactMixinAttrs);
    
    if (reactMixinProperties.length) {
      reactMixinProperties.forEach(this._addNewMixinElement, this);
    } else {
      this._addNewMixinProperty(properties);
    }
  },

  _addNewMixinElement: function(property) {
    var debug = this.debug;
    this.mixins.forEach(function(mixin) {
      if (debug) {
        console.log("Injecting Mixin: " + mixin);
      }
      property.value.elements.push(buildReactMixinElement(mixin));
    });
  },

  _addNewMixinProperty: function(properties) {
    var reactMixinProperty = r.mixins;
    reactMixinProperty.value.elements = this.mixins.map(function(mixin) {
      return buildReactMixinElement(mixin);
    });

    var debug = this.debug;
    if (debug) {
      console.log("Injecting New Mixins: " + this.mixins.join(', '));
    }

    properties.push(reactMixinProperty);
  }
};

module.exports = ReactMixinTransformer;

