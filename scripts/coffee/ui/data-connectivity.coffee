Union = () ->
    @init()
    return @

Union::init = () ->
    @data = []
    @links = []
    @num = 60
    @joins = 0
    @attemptedJoins = 0

    # build our test nodes and links
    i = 0
    while i < @num
        @data.push
            id: i + 1
            parent: i + 1
            children: []
            link: i
            hasParent: false
            color: '#'+Math.floor(Math.random()*16777215).toString(16).replace('o', '0')

        @links.push
            source: i
            target: i
            value: 3
        ++i

    # set the defualt sizes for the graph
    width = $('#tree-graph').width()
    height = 400

    # construct the D3 force layout
    @force = d3.layout.force()
                    .charge(-@num) # set charge ( or push of nodes ) equal to number of nodes
                    .linkDistance(25) # lenght of the connector lines
                    .size([width, height])

    # construct the svg element
    @svg = d3.select('#tree-graph').append('svg')
                    .attr('width', width)
                    .attr('height', height)

    # start up the force layout
    @force
        .nodes( @data ) # add nodes to layout
        .links( @links ) # add links to layout
        .start()

    # build each link
    @link = @svg.selectAll(".link")
                .data( @links )
                .enter()
                .append("line")
                .attr("class", "link")
                .style("stroke-width", (d) -> return Math.sqrt( d.value ) )

    # build each node
    @node = @svg.selectAll( ".node" )
                    .data( @data )
                    .enter()
                    .append( "circle" )
                    .attr( "class", "node" )
                    .attr( "r", 7.5 )
                    .attr( 'cx', (d) -> return Math.floor( Math.random() * ( width - 10 ) ) )
                    .attr( 'cy', (d) -> return Math.floor( Math.random() * ( height - 10 ) ) )
                    .style("fill", (d) -> return d.color )
                    .call(@force.drag)

    # kick off the events for the class
    @events()

Union::events = () ->
    self = @
    evt = App.Util.Events # localize the events object

    # set up our tick event: used to set positon of the nodes and links
    @force.on "tick", () ->
            self.link
                .attr("x1", (d) -> return d.source.x )
                .attr("y1", (d) -> return d.source.y )
                .attr("x2", (d) -> return d.target.x )
                .attr("y2", (d) -> return d.target.y )

            self.node
                .attr("cx", (d) -> return d.x )
                .attr("cy", (d) -> return d.y )

    # handle the click event for the auto button
    $('.auto').on 'click', (e) ->
            self.auto()
            e.preventDefault()

    # handle the click event for the join button
    $('.join').on 'click', (e) ->
            selector1 = parseInt( $( '#num1' ).val(), 10 )
            selector2 = parseInt( $( '#num2' ).val(), 10 )
            node1 = self.getNode( 'id', selector1 )
            node2 = self.getNode( 'id', selector2 )
            self.union(  node1,  node2 )
            e.preventDefault()

    # handle a successful join event
    evt.on 'successful:join', () ->
        $('#joins').find('span').text ++self.joins

    # handle an unsuccessful join event
    evt.on 'unsuccessful:join', () ->
        $('#attempted-joins').find('span').text ++self.attemptedJoins

Union::getUnique = () ->
    prevIndexes = []

    unique = Math.floor( Math.random() * ( @data.length + 1 ) )

    unless _.indexOf( prevIndexes, unique ) > 0
        prevIndexes.push unique
        return unique
    else
        return @getUnique()

Union::root = ( node ) ->
    self = @

    if node.hasParent
        node = @getNode( 'id', node.parent )
        return @root node

    return node

Union::union = ( node1, node2 ) ->
    self = @
    evt = App.Util.Events

    unless @connected node1, node2
        root1 = @root( node1 )
        root2 = @root( node2 )
        weight1 = @weight( root1 )
        weight2 = @weight( root2 )

        if weight1 > weight2
            child = root2
            parent = root1

        else if weight1 == weight2
            child = root2
            parent = root1

        else
            child = root1
            parent = root2

        child.hasParent = true
        child.parent = parent.id
        @links[child.link].target = parent.link
        @setColors child, parent.color
        parent.children.push child.id

        @svg.selectAll('circle')
                .data(@data)
                .attr( 'fill', (d) -> return d.color )
        @force.nodes(u.data)
        @force.start()

        evt.trigger 'successful:join'
        return parent
    else
        return evt.trigger 'unsuccessful:join' 

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

Union::uniqueUnion = () ->
    id1 = @getUnique()
    id2 = @getUnique()
    node1 = @getNode( 'id', id1 )
    node2 = @getNode( 'id', id2 )
    @union( node1, node2 )

Union::auto = () ->
    self = @
    loops = Math.floor( Math.random() * @data.length )
    clearInterval( @loopID )

    @loopID = setInterval ->
        self.uniqueUnion()
        loops--
        if loops == 0
            clearInterval( self.loopID )
    , 200


    return false
    

window.u = new Union

