# -*- coding: utf-8 -*-
"""Viewlets used on the package."""
from collective.texttospeech.interfaces import ITextToSpeechControlPanel
from plone import api
from plone.app.layout.viewlets.common import ViewletBase


class TextToSpeechViewlet(ViewletBase):

    """Viewlet with play button."""

    def enabled(self):
        globally_enabled = api.portal.get_registry_record(
            ITextToSpeechControlPanel.__identifier__ + '.globally_enabled')
        if not globally_enabled:
            return False

        portal_type = getattr(self.context, 'portal_type', None)
        if portal_type is None:
            return False

        enabled_content_types = api.portal.get_registry_record(
            ITextToSpeechControlPanel.__identifier__ + '.enabled_content_types')
        return portal_type in enabled_content_types

    def voice(self):
        return api.portal.get_registry_record(
            ITextToSpeechControlPanel.__identifier__ + '.voice')

    def blacklist(self):
        css_class_blacklist = api.portal.get_registry_record(
            ITextToSpeechControlPanel.__identifier__ + '.css_class_blacklist')

        if not css_class_blacklist:
            return ''

        return ','.join(css_class_blacklist)
