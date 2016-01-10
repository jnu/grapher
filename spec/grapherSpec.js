var Grapher = require('../modules/grapher');

describe('a grapher instance', function () {
  var options = {width: 100, height: 100};

  var network, grapher;

  function getNodeCenter (node) {
    return node.x;
  }

  beforeEach(function () {
    network = {
      nodes: [
        {x: 0, y: 0, r: 20},
        {x: 1, y: 1, r: 15},
        {x: 1, y: 2, r: 25}
      ],
      links: [
        {from: 0, to: 1},
        {from: 1, to: 2}
      ]
    };
    grapher = new Grapher(options);
  });

  afterEach(function () {
    grapher = undefined;
  });

  it('has a renderer, canvas, links, and nodes', function () {
    expect(grapher.renderer).to.not.be.undefined();
    expect(grapher.canvas).to.not.be.undefined();
    expect(grapher.links).to.not.be.undefined();
    expect(grapher.nodes).to.not.be.undefined();
  });

  it('sets and retrieves data', function () {
    grapher.data(network);
    expect(grapher.data()).to.equal(network);
  });

  it('creates or removes nodes and links when setting data', function () {
    expect(grapher.data).to.not.be.undefined();
    grapher.data(network);
    expect(grapher.nodes.length).to.deep.equal(network.nodes.length);
    expect(grapher.links.length).to.deep.equal(network.links.length);
  });

  it('creates nodes and links when entering new data', function () {
    grapher.data(network);
    expect(grapher.enter).to.not.be.undefined();
    network.nodes.push({x: 3, y: 300, r: 10});
    network.links.push({from: 2, to: 3});
    grapher.enter();
    expect(grapher.nodes.length).to.deep.equal(network.nodes.length);
    expect(grapher.links.length).to.deep.equal(network.links.length);
  });

  it('removes nodes and links when exiting new data', function () {
    grapher.data(network);
    expect(grapher.exit).to.not.be.undefined();
    network.nodes.pop();
    network.links.pop();
    grapher.exit();
    expect(grapher.nodes.length).to.deep.equal(network.nodes.length);
    expect(grapher.links.length).to.deep.equal(network.links.length);
  });

  it('updates the position of nodes and links', function () {
    grapher.data(network);
    network.nodes[0].x = 2;
    grapher.update().render();

    expect(getNodeCenter(grapher.nodes[0])).to.deep.equal(network.nodes[0].x);
  });

  it('updates a range of nodes and links', function () {
    grapher.data(network);

    network.nodes[0].x = 2;
    network.nodes[1].x = 5;

    grapher.update('nodes', 0, 2).render();

    expect(getNodeCenter(grapher.nodes[0])).to.deep.equal(network.nodes[0].x);
    expect(getNodeCenter(grapher.nodes[1])).to.deep.equal(network.nodes[1].x);
  });

  it('updates specific nodes and links by an array of indices', function () {
    grapher.data(network);

    network.nodes[0].x = 2;
    network.nodes[1].x = 5;

    grapher.update('nodes', [0, 1]).render();

    expect(getNodeCenter(grapher.nodes[0])).to.deep.equal(network.nodes[0].x);
    expect(getNodeCenter(grapher.nodes[1])).to.deep.equal(network.nodes[1].x);
  });

  it('updates nodes or links individually by index', function () {
    expect(grapher.updateNode).to.not.be.undefined();
    expect(grapher.updateLink).to.not.be.undefined();
    grapher.data(network);

    var n = 0;
    network.nodes[n].x = -100;

    grapher.updateNode(n);
    grapher.render();
    expect(getNodeCenter(grapher.nodes[n])).to.deep.equal(network.nodes[n].x);
  });

  it('updates links attached to updating nodes', function () {
    grapher.data(network);

    network.nodes[0].x = -100;
    grapher.update('nodes', [0]).render();

    expect(grapher.links[0].x1).to.deep.equal(network.nodes[0].x);
  });

  it('transforms', function () {
    var transform = {scale: 0.5, translate: [100, 200]};

    grapher.transform(transform);
    expect(grapher.scale()).to.deep.equal(transform.scale);
    expect(grapher.translate()[0]).to.deep.equal(transform.translate[0]);
    expect(grapher.translate()[1]).to.deep.equal(transform.translate[1]);
  });

  it('resizes', function () {
    expect(grapher.resize).to.not.be.undefined();
    grapher.resize(800, 600);
    expect(grapher.canvas.width).to.equal(800 * devicePixelRatio);
    expect(grapher.canvas.height).to.equal(600 * devicePixelRatio);
  });

  it('can set custom event handlers', function () {
    var handler = function () { return true; },
        e = 'someEvent';
    grapher.on(e, handler);
    expect(grapher.handlers[e][0]).to.equal(handler);
  });

  it('can clear nodes and links', function () {
    grapher.data(network);
    grapher.clear();
    expect(grapher.links.length).to.deep.equal(0);
    expect(grapher.nodes.length).to.deep.equal(0);
  });
});
