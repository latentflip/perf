var Model = require('ampersand-model');
var View = require('ampersand-view');
var mixin = require('ampersand-virtual-dom-mixin');

var directTemplate = function (ctx) {
   var model = ctx.model;
   return {
      "selfClosing": false,
      "attrs": {
        "class": "box-view"
      },
      "type": "tag",
      "children": [
        {
          "type": "text",
          "content": "\n  "
        },
        {
          "selfClosing": false,
          "attrs": {
            "class": "box",
            "id": "box-" + model.number,
            "style": model.style
          },
          "type": "tag",
          "children": [
            {
              "type": "text",
              "content": "\n    " + model.content + "       \n  "
            }
          ],
          "name": "div"
        },
        {
          "type": "text",
          "content": "\n"
        }
      ],
      "name": "div"
    };
};

var Box = Model.extend({
    //props: {
    //    number: ['number', true],
    //    top: ['number', true, 0],
    //    left: ['number', true, 0],
    //    color: ['number', true, 0],
    //    content: ['number', true, 0],
    //    count: ['number', true, 0]
    //},

    //derived: {
    //    style: {
    //        deps: ['top', 'left', 'color'],
    //        fn: function () {
    //            //return "top: "+this.top+"px; left: "+this.left+"; background: rgb(0,0,"+this.color+");";
    //            return {
    //                top: this.top + 'px',
    //                left: this.left + 'px',
    //                background: 'rgb(0,0,' + this.color + ')'
    //            };
    //        }
    //    }
    //},
    initialize: function (a) {
        this.count = 0;
        this.number = a.number;
        this.tick();
    },

    tick: function () {
        var count = this.count += 1;
        var d = {
            number: this.number,
            top: Math.sin(count / 10) * 10,
            left: Math.cos(count / 10) * 10,
            color: (count) % 255,
            content: count % 100,
        };

        d.style = {
            top: d.top + 'px',
            left: d.left + 'px',
            background: 'rgb(0,0,' + d.color + ')'
        };
        this.data = d;
        return d;
    }
});


var BoxView = View.extend(mixin,{

    template: _.template('<div class="box-view">' + $('#amp-underscore-template').html() + '</div>'),

    //template: directTemplate,
    //noParse: true,
    props: {
        unevented: 'any'
    },
    
    //initialize: function() {
    //    //this.model.bind('change', this.render, this);
    //},

    //bindings: {
    //    'model.style': {
    //        type: 'attribute',
    //        name: 'style',
    //        selector: '.box'
    //    },
    //    'model.content': {
    //        type: 'text',
    //        selector: '.box'
    //    }
    //},

    render: function () {
        this.renderWithTemplate({model: this.unevented.tick()});
        return this;
    },
    tick: function () {
        this.render();
    },
});

var boxes;

var ampInit = function() {
    N = 100;
    boxes = _.map(_.range(N), function(i) {
        var box = new Box({number: i});
        var view = new BoxView({unevented: box});
        $('#grid').append(view.render().el);
        return view;
    });
};

var ampAnimate = function() {
    for (var i = 0, l = boxes.length; i < l; i++) {
      boxes[i].tick();
    }
};

window.runAmp = function() {
    reset();
    ampInit();
    benchmarkLoop(ampAnimate);
};
