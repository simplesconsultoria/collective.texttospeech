var MainView = (function() {
  function MainView() {
    this.$el = $('#viewlet-texttospeech');
    this.$button = $('#texttospeech-button', this.$el);
    this.$button.fadeIn();
    this.voice = this.$el.attr('data-voice');
    this.label_stopped = this.$el.attr('data-label-stopped');
    this.label_playing = this.$el.attr('data-label-playing');
    this.label_paused = this.$el.attr('data-label-paused');
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
        // remove spaces to avoid issues with some Firefox versions
        $('#content').text().replace(/\s+/g, ' ').trim(),
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
