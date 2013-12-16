Union = () ->
    @data = []
    i = 0
    while i < 10
        @data.push
            id: i + 1
            parent: i + 1
            children: []
            hasParent: false
            color: '#'+Math.floor(Math.random()*16777215).toString(16) # generate random color
        ++i
    return @

Union::root = ( node ) ->
    self = @

    if node.hasParent
        node = @getNode( 'id', node.parent )
        return @root node

    return node

Union::union = ( node1, node2 ) ->
    self = @
    unless @connected node1, node2
        if @weight( node1 ) > @weight( node2 )
            child = @root node1
            parent = @root node2

        else
            child = @root node2
            parent = @root node1

        child.hasParent = true
        child.parent = parent.id
        @setColors(child, parent.color)
        parent.children.push child.id

        d3.select('#tree-graph').selectAll('rect')
            .data(@data)
            .transition()
            .delay(300)
            .attr('fill', (d) ->
                return d.color
            )

        return parent
    else
        return console.log 'Already connected' 

Union::setColors = (node, color) ->
    self = @
    node.color = color
    if node.children.length > 0
        node.children.forEach ( child, index, children ) ->
            self.setColors( self.getNode( 'id', child ), color )


Union::weight = ( node ) ->
    self = @
    count = 1

    if node.children.length > 0
        node.children.forEach ( child, index, children ) ->
            count += self.weight( self.getNode( 'id', child ) )

    return count

Union::getNode = ( key, value ) ->
    position = 0
    @data.forEach ( item, index, objects ) ->
        if item[key] == value
            position = index
    return @data[position]

Union::connected = ( node1, node2 ) ->
    return @root( node1 ) == @root( node2 )

Union::auto = () ->
    loops = Math.floor( Math.random() * @data.length )
    i = 0

    while i < loops
        @union( @getNode( 'id', Math.floor( Math.random() * @data.length ) ), @getNode( 'id', Math.floor( Math.random() * @data.length ) ) )
        ++i
    console.log 'Complete'

window.u = new Union

width = $('#tree-graph').width()
height = $('#tree-graph').height()

d3.select('#tree-graph').selectAll('rect')
    .data(u.data)
    .enter()
    .append('rect')
    .attr('height', height)
    .attr("width", width / u.data.length - 1)
    .attr('y', 0)
    .attr("x", (d, i) ->
        return i * (width/ u.data.length);
    )
    .attr('fill', (d) ->
        return d.color
    )

$('.auto').on 'click', (e) ->
    u.auto()
    e.preventDefault()

$('.join').on 'click', (e) ->
    node1 = u.getNode( 'id', $( 'input[name="num1"]' ).val() )
    node2 = u.getNode( 'id', $( 'input[name="num2"]' ).val() )
    u.union(  node1,  node2 )
    e.preventDefault()