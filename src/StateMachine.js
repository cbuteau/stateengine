define('src/StateMachine', [
  'https://unpkg.com/pubsub-js@1.8.0/src/pubsub.js'
], function(PubSub) {

  function State(name, options) {
    this.name = name;
    this.options = options;
  }

  function Transition(toState, fromState, event, callbackInfo, parentStateMachine) {
    this.toState = toState;
    this.fromState = fromState;
    this.event = event;
    this.parentStateMachine = parentStateMachine;
    this._callback = this.parentStateMachine.options.callbacks[callbackInfo];
    PubSub.subscribe(this.event, this._eventTrigger.bind(this));
  }

  Transition.prototype = {
    _eventTrigger: function() {
      this.parentStateMachine._triggerTransition(this);
    },
    execute: function() {
      this._callback();
    }
  }

  function StateMachine(options) {
    this.isSetup = false;
    this.options = options;

    this._states = {};
    this._transitions = [];

    this._transitionsToEval = [];

    this._currentState = null;
    // we restart and stop the raf often enough lets create the bound function just once.
    this._boundRaf = this._raf.bind(this);
    this._start();
  }

  StateMachine.prototype = {
    _setup: function() {
      var def = this.options.defintion;

      var stateKeys = Object.keys(def.states);
      for (var i = 0; i < stateKeys.length; i++) {
        var curName = stateKeys[i];
        var opts = def.states[curName];
        var state = new State(curName, opts);
        this._states[curName] = state;
        if (opts && opts.isDefault) {
          this._currentState = state;
        }
      }

      for (var j = 0; j < def.transistions.length; j++) {
        var transInfo = def.transistions[j];
        var trans = new Transition(this._states[transInfo.to], this._states[transInfo.from], transInfo.event, transInfo.callback, this);
        this._transitions.push(trans);
      }
    },
    _raf: function(msstep) {

      if (!this.isSetup) {
        this._setup();
        this.isSetup = true;
      }

      while (this._transitionsToEval.length) {
        var trans = this._transitionsToEval.pop();
        if (this._currentState === trans.fromState) {
          // transition and trigger callback.
          this._currentState = trans.toState;
          trans.execute();
        }
      }

      // you have to keep requesting it or it will just stop.
      //this._start();
    },
    _start: function() {
      this._token = requestAnimationFrame(this._boundRaf);
    },
    _triggerTransition: function(transition) {
      this._transitionsToEval.push(transition);
      this._start();
    }
  }


  return StateMachine;
});
