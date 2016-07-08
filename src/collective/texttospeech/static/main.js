var MainView = (function() {
  function MainView() {
    this.$el = $('#viewlet-texttospeech');
    this.$el.data('texttospeech', this);
    this.$button = $('#texttospeech-button', this.$el);
    this.$button.fadeIn();
    this.voice = this.$el.attr('data-voice');
    this.label_stopped = this.$el.attr('data-label-stopped');
    this.label_playing = this.$el.attr('data-label-playing');
    this.label_paused = this.$el.attr('data-label-paused');
    this.blacklist = this.$el.attr('data-blacklist').split(',');
    this.playing = false;
    this.paused = true;
    this.$button.on('click', $.proxy(this.play_pause, this));
  }
  MainView.prototype.onstart = function() {
    this.playing = true;
    this.paused = false;
    this.$button.html(this.label_playing);
    this.$button.attr('class', 'playing');
  };
  MainView.prototype.onend = function() {
    this.playing = false;
    this.paused = true;
    this.$button.html(this.label_stopped);
    this.$button.attr('class', 'stopped');
  };
  MainView.prototype.is_invisible = function($el) {
    // check if element is not visible
    return $el.is(':visible') === false;
  };
  MainView.prototype.is_blacklisted = function($el) {
    // check if element, or a parent, has applied a class that must be skipped
    var i, len, selector;
    for (i = 0, len = this.blacklist.length; i < len; i++) {
      selector = '.' + this.blacklist[i];
      if ($el.is(selector)) {
        return true;
      }
    }
    return false;
  };
  MainView.prototype.is_valid_element = function(el) {
    // check if element is a text or any container (ex.: <div> <p>)
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#Node_type_constants
    var valid_types = [
      Node.ELEMENT_NODE,
      Node.TEXT_NODE
    ];
    return valid_types.indexOf(el.nodeType) >= 0;
  };
  MainView.prototype.has_ending_punctuation = function(text) {
    // check if the text ends with a punctuation mark (simplified list)
    // http://stackoverflow.com/a/29226668/644075 (complete list)
    return /[.,;:!?—]$/.test(text);
  };
  MainView.prototype.remove_extra_spaces = function(text) {
    // remove extra spaces into text
    text = text.replace(/\s+/g, ' ');
    text = text.trim();
    return text
  };
  MainView.prototype.has_valid_text = function($node) {
    // check if node has any valid text element
    var i, len, ref, el;
    ref = $node.contents();
    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i];
      if (el.nodeType === Node.TEXT_NODE &&
          el.textContent.replace(/[.,;:!?()—\r\n\s]*/g, '') !== '') {
        return true;
      }
    }
    return false;
  };
  MainView.prototype.remove_invisible_items = function(child) {
    // recursive method used in conjunction with walk_tree to remove invisible elements
    $child = $(child);
    if (child.nodeType === Node.ELEMENT_NODE &&
        this.is_invisible($child) === false) {
      $child.remove();
      return;
    }
    this.walk_tree($child, this.remove_invisible_items);
  };
  MainView.prototype.extract_element_text = function(child) {
    // recursive method used in conjunction with walk_tree to extract texts
    $child = $(child);
    if (this.is_valid_element(child) === false ||
        this.is_invisible($child)    === true  ||
        this.is_blacklisted($child)  === true) {
      return;
    }
    if (child.nodeType === Node.TEXT_NODE) {
      text = $child.text();
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      if (this.has_valid_text($child) === true) {
        var $clone = $child.clone();
        this.walk_tree($clone, this.remove_invisible_items);
        text = $clone.text();
      } else {
        this.walk_tree($child, this.extract_element_text);
        return;
      }
    }
    text = this.remove_extra_spaces(text);
    // remove empty lines
    if (text.replace(/[.,;:!?()—\r\n\s]*/g, '') === '') {
      return;
    }
    // ensure there is a pause after every line adding a period
    if (this.has_ending_punctuation(text) === false) {
      text += '.';
    }
    this.results.push(text);
  };
  MainView.prototype.walk_tree = function($node, callback) {
    // this method recursivelly walks into elements tree and call callback method
    var i, len, child, $child, text;
    var ref = $node.contents();
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      callback.call(this, child);
    }
  };
  MainView.prototype.extract_text = function() {
    // extract page text
    var i, len, $el, text, byline_added;
    this.results = [];
    this.walk_tree($('#content'), this.extract_element_text);
    return this.results.join(' ');
  };
  MainView.prototype.play_pause = function(e) {
    // play/pause button
    e.preventDefault();
    if (this.playing) {
      if (this.paused) {
        this.paused = false;
        this.$button.html(this.label_playing);
        this.$button.attr('class', 'playing');
        responsiveVoice.resume();
      } else {
        this.paused = true;
        this.$button.html(this.label_paused);
        this.$button.attr('class', 'paused');
        responsiveVoice.pause();
      }
    } else {
      responsiveVoice.speak(
        this.extract_text(),
        this.voice, {
          onstart: $.proxy(this.onstart, this),
          onend: $.proxy(this.onend, this)
        }
      );
    }
  };
  return MainView;
})();


var ControlPanelView = (function() {
  function ControlPanelView() {
    this.template = "<select id=\"form-widgets-voice\" name=\"form.widgets.voice\" class=\"text-widget required textline-field\">\n</select>";
    this.actual_voice = $('#form-widgets-voice').val();
    this.render();
  }
  ControlPanelView.prototype.render = function() {
    $('#form-widgets-voice').replaceWith(this.template);
    var voicelist = responsiveVoice.getVoices();
    var vselect = $('#form-widgets-voice');
    var i, len, voice;
    for (i = 0, len = voicelist.length; i < len; i++) {
      voice = voicelist[i];
      if (voice.name === this.actual_voice) {
        vselect.append($('<option selected="selected" />').val(voice.name).text(voice.name));
      } else {
        vselect.append($('<option />').val(voice.name).text(voice.name));
      }
    }
  };
  return ControlPanelView;
})();


if (typeof window.responsiveVoice !== "undefined") {
  responsiveVoice.addEventListener("OnReady", function() {
    if ($('#viewlet-texttospeech').length > 0) {
      new MainView();
    }
    if ($('body.template-texttospeech-settings').length > 0) {
      new ControlPanelView();
    }
  });
} else {
  $(function() {
    var $el = $('#viewlet-texttospeech');
    var error_message = $el.attr('data-error-message');
    if ($('#viewlet-texttospeech').length > 0) {
      console.log(error_message);
    }
    if ($('body.template-texttospeech-settings').length > 0) {
      alert(error_message);
    }
  });
}
