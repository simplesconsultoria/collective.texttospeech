# -*- coding: utf-8 -*-
from collective.texttospeech.interfaces import ITextToSpeechControlPanel
from plone import api
from plone.api.exc import InvalidParameterError
from Products.Five.browser import BrowserView


class HelperView(BrowserView):

    """Information about the state of the Text-To-Speech feature."""

    def enabled(self):
        """Check if the ResponsiveVoice library needs to be loaded or
        not. We need to load it only if the feature is enabled or if
        the context is the configlet.
        """
        configlet = '@@texttospeech-settings'
        if self.request.get('URL', '').endswith(configlet):
            return True

        try:
            globally_enabled = api.portal.get_registry_record(
                interface=ITextToSpeechControlPanel, name='globally_enabled')
        except (InvalidParameterError, KeyError):
            # avoid breaking page rendering if record is not present
            # this could happen on upgrades or accidental deletions
            globally_enabled = False

        return globally_enabled
