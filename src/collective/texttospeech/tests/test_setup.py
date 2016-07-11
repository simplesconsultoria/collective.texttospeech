# -*- coding: utf-8 -*-
"""Ensure add-on is properly installed and uninstalled."""
from collective.texttospeech.config import IS_PLONE_5
from collective.texttospeech.config import PROJECTNAME
from collective.texttospeech.interfaces import IBrowserLayer
from collective.texttospeech.testing import INTEGRATION_TESTING
from plone.browserlayer.utils import registered_layers

import unittest


JAVASCRIPTS = (
    '//code.responsivevoice.org/1.4/responsivevoice.js',
    '++resource++collective.texttospeech/main.js',
)

CSS = '++resource++collective.texttospeech/main.css'


class InstallTestCase(unittest.TestCase):

    """Ensure product is properly installed."""

    layer = INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']

    def test_installed(self):
        qi = self.portal['portal_quickinstaller']
        self.assertTrue(qi.isProductInstalled(PROJECTNAME))

    def test_addon_layer(self):
        self.assertIn(IBrowserLayer, registered_layers())

    @unittest.skipIf(IS_PLONE_5, 'No easy way to test this under Plone 5')
    def test_jsregistry(self):
        resource_ids = self.portal.portal_javascripts.getResourceIds()
        for id_ in JAVASCRIPTS:
            self.assertIn(id_, resource_ids, id_ + ' not installed')

    @unittest.skipIf(IS_PLONE_5, 'No easy way to test this under Plone 5')
    def test_cssregistry(self):
        resource_ids = self.portal.portal_css.getResourceIds()
        self.assertIn(CSS, resource_ids)

    def test_setup_permission(self):
        permission = 'collective.texttospeech: Setup'
        roles = self.portal.rolesOfPermission(permission)
        roles = [r['name'] for r in roles if r['selected']]
        expected = ['Manager', 'Site Administrator']
        self.assertListEqual(roles, expected)

    def test_profile_version(self):
        profile = PROJECTNAME + ':default'
        setup_tool = self.portal['portal_setup']
        self.assertEqual(
            setup_tool.getLastVersionForProfile(profile), (u'4',))


class UninstallTestCase(unittest.TestCase):

    """Ensure product is properly uninstalled."""

    layer = INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.qi = self.portal['portal_quickinstaller']
        self.qi.uninstallProducts(products=[PROJECTNAME])

    def test_uninstalled(self):
        self.assertFalse(self.qi.isProductInstalled(PROJECTNAME))

    def test_addon_layer_removed(self):
        self.assertNotIn(IBrowserLayer, registered_layers())

    @unittest.skipIf(IS_PLONE_5, 'No easy way to test this under Plone 5')
    def test_jsregistry_removed(self):
        resource_ids = self.portal.portal_javascripts.getResourceIds()
        for id_ in JAVASCRIPTS:
            self.assertNotIn(id_, resource_ids, id_ + ' not removed')

    @unittest.skipIf(IS_PLONE_5, 'No easy way to test this under Plone 5')
    def test_cssregistry_removed(self):
        resource_ids = self.portal.portal_css.getResourceIds()
        self.assertNotIn(CSS, resource_ids)
