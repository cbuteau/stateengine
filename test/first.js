

var StateMachine;

var PubSub;

describe('The First Tests', function() {

  beforeAll(function(done) {

    // <link type="text/css" href="/base/test/basic.css" rel="stylesheet">
    var link = document.createElement('link');
    link.type = 'text/css';
    link.href = '/base/test/basic.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    var root = document.createElement('div');

    document.body.appendChild(root);

    var login = document.createElement('div');
    login.classList.add('base');
    login.classList.add('login');
    login.innerHTML = 'Login';
    root.appendChild(login);

    var app = document.createElement('div');
    app.classList.add('base');
    app.classList.add('app');
    app.innerHTML = 'App';
    root.appendChild(app);

    var options = document.createElement('div');
    options.classList.add('base');
    options.classList.add('options');
    options.innerHTML = 'Options';
    root.appendChild(options);


    // addStyle("
    //
    //   base {
    //     height: 75px;
    //     width: 200px;
    //   }
    //
    //    login {
    //      background-color: red;
    //    }
    //    app {
    //      background-color: green;
    //    }
    //    options {
    //      background-color: blue;
    //    }
    // ");

    require(['src/StateMachine',
      'https://unpkg.com/pubsub-js@1.8.0/src/pubsub.js'
    ], function(StateMachineLoaded, PubSubLoaded) {
      StateMachine = StateMachineLoaded;
      PubSub = PubSubLoaded;
      done();
    });

  });


  it ('check ', function() {
    var check = document.querySelector('.login');



    expect(check).not.toBeNull();
  });

  it ('Create', function(done) {
    var stateDef = {
      defintion: {
        states: {
          APP: {},
          LOGIN: {
            isDefault: true
          },
          OPTIONS: {}
        },
        transistions: [
          {
            from: 'LOGIN',
            to: 'APP',
            event: 'LoggedIn',
            callback: 'showApp'
          },
          {
            from: 'APP',
            to: 'LOGIN',
            event: 'LoggedOut',
            callback: 'showLogin'
          },
          {
            from: 'APP',
            to: 'OPTIONS',
            event: 'ShowOptions',
            callback: 'showOptions'
          }
        ]
      },
      callbacks: {
        showLogin: function() {

        },
        showApp: function() {

        },
        showOptions: function() {

        }
      }
    };

    spyOn(stateDef.callbacks, 'showApp').and.callThrough();

    var sm = new StateMachine(stateDef);

    setTimeout(function() {
      PubSub.publish('LoggedIn');

      setTimeout(function() {

        expect(stateDef.callbacks.showApp).toHaveBeenCalled();

        done();
      }, 100);


    }, 500);
  })

});
