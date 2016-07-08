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
    return $el.is(':visible') === false;
  };
  MainView.prototype.is_blacklisted = function($el) {
    // check if element, or a parent, has applied a class that must be skipped
    var i, len, selector;
    var ignore = false;
    for (i = 0, len = this.blacklist.length; i < len; i++) {
      selector = '.' + this.blacklist[i];
      if ($el.is(selector) || $el.parents(selector).length > 0) {
        ignore = true;
        break;
      }
    }
    return ignore;
  };
  MainView.prototype.has_ending_punctuation = function(text) {
    // check if the text ends with a punctuation mark (simplified list)
    // http://stackoverflow.com/a/29226668/644075 (complete list)
    return /[.,;:!?—]$/.test(text);
  };
  MainView.prototype.remove_extra_spaces = function(text) {
    text = text.replace(/\s+/g, ' ');
    text = text.trim();
    return text
  };
  MainView.prototype.extract_text = function() {
    var i, len, ref, results, $el, text;
    results = [];
    // get all leaf nodes inside the content
    // http://stackoverflow.com/a/4602476/644075
    ref = $('#content *:not(:has(*))');
    for (i = 0, len = ref.length; i < len; i++) {
      $el = $(ref[i]);
      if (this.is_invisible($el) || this.is_blacklisted($el)) {
        continue;
      }
      text = $el.text();
      text = this.remove_extra_spaces(text);
      // ignore empty lines
      if (text.length === 0) {
        continue;
      }
      // ensure there is a pause after every line adding a period
      if (!this.has_ending_punctuation(text)) {
        text += '.';
      }
      results.push(text);
    }
    // join array with texts
    return results.join(' ');
  };
  MainView.prototype.play_pause = function(e) {
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
