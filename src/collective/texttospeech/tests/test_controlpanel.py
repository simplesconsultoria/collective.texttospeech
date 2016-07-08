# -*- coding: utf-8 -*-
from collective.texttospeech.config import DEFAULT_CSS_CLASS_BLACKLIST
from collective.texttospeech.config import DEFAULT_ENABLED_CONTENT_TYPES
from collective.texttospeech.config import PROJECTNAME
from collective.texttospeech.interfaces import ITextToSpeechControlPanel
from collective.texttospeech.testing import INTEGRATION_TESTING
from plone import api
from plone.app.testing import logout
from plone.registry.interfaces import IRegistry
from zope.component import getUtility

import unittest


class ControlPanelTestCase(unittest.TestCase):

    layer = INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.controlpanel = self.portal['portal_controlpanel']

    def test_controlpanel_has_view(self):
        request = self.layer['request']
        view = api.content.get_view('texttospeech-settings', self.portal, request)
        view = view.__of__(self.portal)
        self.assertTrue(view())

    def test_controlpanel_view_is_protected(self):
        from AccessControl import Unauthorized
        logout()
        with self.assertRaises(Unauthorized):
            self.portal.restrictedTraverse('@@texttospeech-settings')

    def test_controlpanel_installed(self):
        actions = [
            a.getAction(self)['id'] for a in self.controlpanel.listActions()]
        self.assertIn('texttospeech', actions)

    def test_controlpanel_removed_on_uninstall(self):
        qi = self.portal['portal_quickinstaller']
        qi.uninstallProducts(products=[PROJECTNAME])

        actions = [
            a.getAction(self)['id'] for a in self.controlpanel.listActions()]
        self.assertNotIn('texttospeech', actions)


class RegistryTestCase(unittest.TestCase):

    layer = INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.registry = getUtility(IRegistry)
        self.settings = self.registry.forInterface(ITextToSpeechControlPanel)

    def test_globally_enabled_record_in_registry(self):
        self.assertTrue(hasattr(self.settings, 'globally_enabled'))
        self.assertEqual(self.settings.globally_enabled, False)

    def test_enabled_content_types_record_in_registry(self):
        self.assertTrue(hasattr(self.settings, 'enabled_content_types'))
        self.assertEqual(self.settings.enabled_content_types, DEFAULT_ENABLED_CONTENT_TYPES)

    def test_voice_record_in_registry(self):
        self.assertTrue(hasattr(self.settings, 'voice'))
        self.assertEqual(self.settings.voice, u'UK English Female')

    def test_css_class_blacklist_record_in_registry(self):
        self.assertTrue(hasattr(self.settings, 'css_class_blacklist'))
        self.assertEqual(self.settings.css_class_blacklist, DEFAULT_CSS_CLASS_BLACKLIST)

    def test_records_removed_on_uninstall(self):
        qi = self.portal['portal_quickinstaller']
        qi.uninstallProducts(products=[PROJECTNAME])

        records = [
            ITextToSpeechControlPanel.__identifier__ + '.globally_enabled',
            ITextToSpeechControlPanel.__identifier__ + '.enabled_content_types',
            ITextToSpeechControlPanel.__identifier__ + '.voice',
            ITextToSpeechControlPanel.__identifier__ + '.css_class_blacklist',
        ]

        for r in records:
            self.assertNotIn(r, self.registry)
