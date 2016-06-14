.. image:: https://raw.githubusercontent.com/collective/collective.texttospeech/master/docs/texttospeech.png
    :align: left
    :alt: Text-to-Speech
    :height: 100px
    :width: 100px

**************
Text-to-Speech
**************

.. contents:: Table of Contents

Life, the Universe, and Everything
==================================

This package enables a Text-to-Speech feature in Plone.

It is currently based on `ResponsiveVoice <http://responsivevoice.org/>`_,
an HTML5-based Text-To-Speech library designed to add voice features to web sites across multiple plataforms.

ResponsiveVoice supports 51 languages through 168 voices and is `free for non-commercial use <http://responsivevoice.org/license/>`_.

Mostly Harmless
===============

.. image:: http://img.shields.io/pypi/v/collective.texttospeech.svg
   :target: https://pypi.python.org/pypi/collective.texttospeech

.. image:: https://img.shields.io/travis/collective/collective.texttospeech/master.svg
    :target: http://travis-ci.org/collective/collective.texttospeech

.. image:: https://img.shields.io/coveralls/collective/collective.texttospeech/master.svg
    :target: https://coveralls.io/r/collective/collective.texttospeech

Got an idea? Found a bug? Let us know by `opening a support <https://github.com/collective/collective.texttospeech/issues>`_.

Known Issues
------------

- Voice playback rate is slow on Android native browser
- Voice is cut off in shorter text on Android native browser
- Audio doesn’t play on Firefox Android

For more information, see `ResponsiveVoice FAQ <http://responsivevoice.org/faq/>`_.

Some browser add-ons (e.g., `Privacy Badger <https://www.eff.org/privacybadger>`_), could block ResponsiveVoice library disabling the Text-to-Speech feature.
In those cases the 'Listen' button will not be available,
neither the Text-To-Speech control panel configlet will work.

Don't Panic
===========

Installation
------------

To enable this package in a buildout-based installation:

#. Edit your buildout.cfg and add add the following to it:

.. code-block:: ini

    [buildout]
    ...
    eggs =
        collective.texttospeech

After updating the configuration you need to run ''bin/buildout'', which will take care of updating your system.

Go to the 'Site Setup' page in a Plone site and click on the 'Add-ons' link.

Check the box next to ``collective.texttospeech`` and click the 'Activate' button.

Usage
-----

After installing the package, go to the Text-To-Speech configlet on Site Setup.

Select which content types will have the feature enabled and select which voice will be used.

.. figure:: https://raw.githubusercontent.com/collective/collective.texttospeech/master/docs/controlpanel.png
    :align: center
    :height: 600px
    :width: 768px

    The Text-To-Speech control panel configlet.

A viewlet with a 'Listen' button will be displayed on objects with the feature enabled.

.. figure:: https://raw.githubusercontent.com/collective/collective.texttospeech/master/docs/viewlet.png
    :align: center
    :height: 400px
    :width: 768px

    The Text-To-Speech feature enabled.

You can pause/resume the reader at any time by selecting 'Pause'/'Resume'.

How does it work
----------------

Text to speech extract the text of the page, and send the text to `ResponsiveVoice <http://responsivevoice.org/>`_ to play the text.

By default, the text extraction need to ignore some elements that should not be played:

* Blockquotes
* IFrames
* Image captions

And there are other custom elements that should be ignored, to manage these custom elements we use a blacklist.

The blacklist is filled into the package configlet and should be filled with one CSS selector by line that should be ignored.
