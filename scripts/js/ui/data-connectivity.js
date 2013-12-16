(function() {
  var Union;

  Union = function() {
    this.init();
    return this;
  };

  Union.prototype.init = function() {
    var height, i, width;
    this.data = [];
    this.links = [];
    i = 0;
    while (i < 100) {
      this.data.push({
        id: i + 1,
        parent: i + 1,
        children: [],
        link: i,
        hasParent: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).replace('o', '0')
      });
      this.links.push({
        source: i,
        target: i,
        value: 5
      });
      ++i;
    }
    width = $('#tree-graph').width();
    height = 400;
    this.force = d3.layout.force().charge(-60).linkDistance(25).size([width, height]);
    this.svg = d3.select('#tree-graph').append('svg').attr('width', width).attr('height', height);
    this.force.nodes(this.data).links(this.links).start();
    this.link = this.svg.selectAll(".link").data(this.links).enter().append("line").attr("class", "link").style("stroke-width", function(d) {
      return Math.sqrt(d.value);
    });
    this.node = this.svg.selectAll(".node").data(this.data).enter().append("circle").attr("class", "node").attr("r", 7.5).attr('cx', function(d) {
      return Math.floor(Math.random() * (width - 10));
    }).attr('cy', function(d) {
      return Math.floor(Math.random() * (height - 10));
    }).style("fill", function(d) {
      return d.color;
    }).call(this.force.drag);
    return this.events();
  };

  Union.prototype.getUnique = function() {
    var prevIndexes, unique;
    prevIndexes = [];
    unique = Math.floor(Math.random() * (this.data.length + 1));
    if (!(_.indexOf(prevIndexes, unique) > 0)) {
      prevIndexes.push(unique);
      return unique;
    } else {
      return this.getUnique();
    }
  };

  Union.prototype.events = function() {
    var self;
    self = this;
    this.force.on("tick", function() {
      self.link.attr("x1", function(d) {
        return d.source.x;
      }).attr("y1", function(d) {
        return d.source.y;
      }).attr("x2", function(d) {
        return d.target.x;
      }).attr("y2", function(d) {
        return d.target.y;
      });
      return self.node.attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
    });
    $('.auto').on('click', function(e) {
      self.auto();
      return e.preventDefault();
    });
    return $('.join').on('click', function(e) {
      var node1, node2, selector1, selector2;
      selector1 = parseInt($('#num1').val(), 10);
      selector2 = parseInt($('#num2').val(), 10);
      node1 = self.getNode('id', selector1);
      node2 = self.getNode('id', selector2);
      self.union(node1, node2);
      return e.preventDefault();
    });
  };

  Union.prototype.root = function(node) {
    var self;
    self = this;
    if (node.hasParent) {
      node = this.getNode('id', node.parent);
      return this.root(node);
    }
    return node;
  };

  Union.prototype.union = function(node1, node2) {
    var child, parent, root1, root2, self, weight1, weight2;
    self = this;
    if (!this.connected(node1, node2)) {
      root1 = this.root(node1);
      root2 = this.root(node2);
      weight1 = this.weight(root1);
      weight2 = this.weight(root2);
      if (weight1 > weight2) {
        child = root2;
        parent = root1;
      } else if (weight1 === weight2) {
        child = root2;
        parent = root1;
      } else {
        child = root1;
        parent = root2;
      }
      child.hasParent = true;
      child.parent = parent.id;
      this.links[child.link].target = parent.link;
      this.setColors(child, parent.color);
      parent.children.push(child.id);
      this.svg.selectAll('circle').data(this.data).attr('fill', function(d) {
        return d.color;
      });
      this.force.nodes(u.data);
      this.force.start();
      return parent;
    } else {
      return console.log('Already connected');
    }
  };

  Union.prototype.setColors = function(node, color) {
    var self;
    self = this;
    node.color = color;
    if (node.children.length > 0) {
      return node.children.forEach(function(child, index, children) {
        return self.setColors(self.getNode('id', child), color);
      });
    }
  };

  Union.prototype.weight = function(node) {
    var count, self;
    self = this;
    count = 1;
    if (node.children.length > 0) {
      node.children.forEach(function(child, index, children) {
        return count += self.weight(self.getNode('id', child));
      });
    }
    return count;
  };

  Union.prototype.getNode = function(key, value) {
    var position;
    position = 0;
    this.data.forEach(function(item, index, objects) {
      if (item[key] === value) {
        return position = index;
      }
    });
    return this.data[position];
  };

  Union.prototype.connected = function(node1, node2) {
    return this.root(node1) === this.root(node2);
  };

  Union.prototype.uniqueUnion = function() {
    var id1, id2, node1, node2;
    id1 = this.getUnique();
    id2 = this.getUnique();
    node1 = this.getNode('id', id1);
    node2 = this.getNode('id', id2);
    return this.union(node1, node2);
  };

  Union.prototype.auto = function() {
    var i, loops;
    loops = Math.floor(Math.random() * this.data.length);
    i = 0;
    while (i < loops) {
      this.uniqueUnion();
      ++i;
    }
    return false;
  };

  window.u = new Union;

}).call(this);
