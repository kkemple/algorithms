(function() {
  var Union, height, width;

  Union = function() {
    var i;
    this.data = [];
    i = 0;
    while (i < 10) {
      this.data.push({
        id: i + 1,
        parent: i + 1,
        children: [],
        hasParent: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      });
      ++i;
    }
    return this;
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
    var child, parent, self;
    self = this;
    if (!this.connected(node1, node2)) {
      if (this.weight(node1) > this.weight(node2)) {
        child = this.root(node1);
        parent = this.root(node2);
      } else {
        child = this.root(node2);
        parent = this.root(node1);
      }
      child.hasParent = true;
      child.parent = parent.id;
      this.setColors(child, parent.color);
      parent.children.push(child.id);
      d3.select('#tree-graph').selectAll('rect').data(this.data).transition().delay(300).attr('fill', function(d) {
        return d.color;
      });
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

  Union.prototype.auto = function() {
    var i, loops;
    loops = Math.floor(Math.random() * this.data.length);
    i = 0;
    while (i < loops) {
      this.union(this.getNode('id', Math.floor(Math.random() * this.data.length)), this.getNode('id', Math.floor(Math.random() * this.data.length)));
      ++i;
    }
    return console.log('Complete');
  };

  window.u = new Union;

  width = $('#tree-graph').width();

  height = $('#tree-graph').height();

  d3.select('#tree-graph').selectAll('rect').data(u.data).enter().append('rect').attr('height', height).attr("width", width / u.data.length - 1).attr('y', 0).attr("x", function(d, i) {
    return i * (width / u.data.length);
  }).attr('fill', function(d) {
    return d.color;
  });

  $('.auto').on('click', function(e) {
    u.auto();
    return e.preventDefault();
  });

  $('.join').on('click', function(e) {
    var node1, node2;
    node1 = u.getNode('id', $('input[name="num1"]').val());
    node2 = u.getNode('id', $('input[name="num2"]').val());
    u.union(node1, node2);
    return e.preventDefault();
  });

}).call(this);
