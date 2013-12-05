// Generated by CoffeeScript 1.6.3
(function() {
  var Termic;

  Termic = (function() {
    function Termic() {}

    Termic.prototype.constructer = function(el, terminal, commands) {
      this.el = el;
      this.terminal = terminal;
      this.commands = commands != null ? commands : {};
      this._storage = {};
      this._history = [];
      this._history_index = -1;
      this.addCommand('help', 'List of available commands', function(params) {
        var cmd, cmd_name, list;
        list = (function() {
          var _ref, _results;
          _ref = this.commands;
          _results = [];
          for (cmd_name in _ref) {
            cmd = _ref[cmd_name];
            if (cmd_name !== '__init__') {
              _results.push("" + cmd_name + " \t\t " + cmd.description);
            } else {

            }
          }
          return _results;
        }).call(this);
        return "Available commands: \n" + (list.join("\n"));
      });
      this.addCommand('clear', 'Clears the screen', function() {
        this.terminal.innerHTML = '';
        return this.runCommand('__init__', [], true);
      });
      this.listen();
      this.init();
      this.el.focus();
      return this;
    };

    Termic.prototype.init = function() {
      var _ref;
      return this.appendToTerminal(this.createFormat("termic-entry", (_ref = this.commands['__init__'].handler) != null ? _ref.call(this) : void 0));
    };

    Termic.prototype.listen = function() {
      var _this = this;
      return this.el.addEventListener('keydown', function(e) {
        var key;
        key = e.which ? e.which : e.keyCode;
        if (key === 13) {
          _this.handleCommand();
          return false;
        } else if (key === 9) {
          e.preventDefault();
          _this.handleTab();
          return false;
        } else if (key === 38) {
          e.preventDefault();
          _this.handleHistory('up');
          return false;
        } else if (key === 40) {
          e.preventDefault();
          _this.handleHistory('down');
          return false;
        }
      });
    };

    Termic.prototype.addCommand = function(name, description, handler) {
      if (this.commands[name]) {
        console.info('#{command} already attached');
      } else {
        this.commands[name] = {
          description: description,
          handler: handler
        };
      }
      return this;
    };

    Termic.prototype.handleHistory = function(direction) {
      this.calculateHistoryIndex(direction);
      return this.el.value = this._history[this._history_index] ? this._history[this._history_index] : '';
    };

    Termic.prototype.calculateHistoryIndex = function(direction) {
      switch (direction) {
        case 'up':
          this._history_index += 1;
          if (this._history_index > this._history.length - 1) {
            return this._history_index = 0;
          }
          break;
        case 'down':
          this._history_index -= 1;
          if (this._history_index < 0) {
            return this._history_index = this._history.length - 1;
          }
      }
    };

    Termic.prototype.handleCommand = function() {
      var command, input, input_pieces, params;
      input = this.el.value;
      input_pieces = input.split(' ');
      command = input_pieces.shift();
      params = input_pieces;
      this.appendToTerminal(this.createFormat("termic-command", "> " + input));
      this.el.value = '';
      return this.runCommand(command, params);
    };

    Termic.prototype.handleTab = function() {
      var cmd, cmd_name, input, list, regex;
      input = this.el.value;
      regex = new RegExp("^" + input, "gi");
      list = (function() {
        var _ref, _results;
        _ref = this.commands;
        _results = [];
        for (cmd_name in _ref) {
          cmd = _ref[cmd_name];
          if ((cmd_name.match(regex)) && (cmd_name !== '__init__')) {
            _results.push(cmd_name);
          } else {

          }
        }
        return _results;
      }).call(this);
      if (list.length === 1) {
        return this.el.value = "" + list[0] + " ";
      } else if (list.length > 1) {
        return this.appendToTerminal(this.createFormat('termic-suggestions', "Suggestions: " + (list.join(', '))));
      }
    };

    Termic.prototype.runCommand = function(command, params, hidden) {
      var _ref;
      if (hidden == null) {
        hidden = false;
      }
      if (!hidden) {
        this._history.splice(0, 0, "" + command + " " + (params.join(' ')));
        this._history_index = -1;
      }
      if (this.commands[command]) {
        return this.appendToTerminal(this.createFormat("termic-entry", (_ref = this.commands[command].handler) != null ? _ref.call(this, params) : void 0));
      } else {
        return this.appendToTerminal(this.createFormat("termic-error", "&laquo;" + command + "&raquo; command not found."));
      }
    };

    Termic.prototype.appendToTerminal = function(message) {
      this.terminal.innerHTML = "" + this.terminal.innerHTML + " " + message;
      return typeof window.scrollTo === "function" ? window.scrollTo(0, this.terminal.scrollHeight) : void 0;
    };

    Termic.prototype.createFormat = function(cls, message) {
      var Container, Message;
      if (message) {
        Container = document.createElement('div');
        Message = document.createElement('div');
        Message.className = cls;
        Message.innerHTML = message;
        Container.appendChild(Message);
        return Container.innerHTML;
      } else {
        return '';
      }
    };

    Termic.prototype.set = function(key, value) {
      return this._storage[key] = value;
    };

    Termic.prototype.get = function(key) {
      return this._storage[key];
    };

    return Termic;

  })();

  window.Termic = Termic;

}).call(this);
