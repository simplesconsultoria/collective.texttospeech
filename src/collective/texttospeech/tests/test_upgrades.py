# -*- coding: utf-8 -*-
from collective.texttospeech.config import IS_PLONE_5
from collective.texttospeech.testing import INTEGRATION_TESTING
from plone import api

import unittest


class UpgradeBaseTestCase(unittest.TestCase):

    layer = INTEGRATION_TESTING
    profile_id = u'collective.texttospeech:default'

    def setUp(self):
        self.portal = self.layer['portal']
        self.setup = self.portal['portal_setup']
        self.setup.setLastVersionForProfile(self.profile_id, self.from_)

    def _get_upgrade_step_by_title(self, title):
        """Return the upgrade step that matches the title specified."""
        self.setup.setLastVersionForProfile(self.profile_id, self.from_)
        upgrades = self.setup.listUpgrades(self.profile_id)
        steps = [s for s in upgrades[0] if s['title'] == title]
        return steps[0] if steps else None

    def _do_upgrade(self, step):
        """Execute an upgrade step."""
        request = self.layer['request']
        request.form['profile_id'] = self.profile_id
        request.form['upgrades'] = [step['id']]
        self.setup.manage_doUpgrades(request=request)


class To2TestCase(UpgradeBaseTestCase):

    from_ = '1'
    to_ = '2'

    def test_profile_version(self):
        version = self.setup.getLastVersionForProfile(self.profile_id)[0]
        self.assertEqual(version, self.from_)

    def test_registered_steps(self):
        steps = len(self.setup.listUpgrades(self.profile_id)[0])
        self.assertEqual(steps, 3)

    @unittest.skipIf(IS_PLONE_5, 'Upgrade step not supported under Plone 5')
    def test_pin_responsivevoice(self):
        # check if the upgrade step is registered
        title = u'Use version 1.4 of the ResponsiveVoice API'
        step = self._get_upgrade_step_by_title(title)
        assert step is not None

        # simulate state on previous version
        from collective.texttospeech.upgrades.v2 import NEW_JS
        from collective.texttospeech.upgrades.v2 import OLD_JS
        portal_js = api.portal.get_tool('portal_javascripts')
        # HACK: can not use portal_js.renameResource
        #       see: https://github.com/plone/Products.ResourceRegistries/pull/20
        portal_js.getResource(NEW_JS)._data['id'] = OLD_JS
        assert OLD_JS in portal_js.getResourceIds()

        # run the upgrade step to validate the update
        self._do_upgrade(step)
        self.assertNotIn(OLD_JS, portal_js.getResourceIds())
        self.assertIn(NEW_JS, portal_js.getResourceIds())


class To3TestCase(UpgradeBaseTestCase):

    from_ = '2'
    to_ = '3'

    def test_profile_version(self):
        version = self.setup.getLastVersionForProfile(self.profile_id)[0]
        self.assertEqual(version, self.from_)

    def test_registered_steps(self):
        steps = len(self.setup.listUpgrades(self.profile_id)[0])
        self.assertEqual(steps, 4)

    @unittest.skipIf(IS_PLONE_5, 'Upgrade step not supported under Plone 5')
    def test_update_library_condition(self):
        # check if the upgrade step is registered
        title = u'Update the condition used to load ResponsiveVoice library'
        step = self._get_upgrade_step_by_title(title)
        assert step is not None

        # simulate state on previous version
        from collective.texttospeech.upgrades.v3 import JS
        from collective.texttospeech.upgrades.v3 import EXPRESSION
        portal_js = api.portal.get_tool('portal_javascripts')
        resource = portal_js.getResource(JS)
        resource.setExpression('')
        assert resource.getExpression() == ''

        # run the upgrade step to validate the update
        self._do_upgrade(step)
        self.assertEqual(resource.getExpression(), EXPRESSION)

    def test_add_css_class_blacklist_field(self):
        # check if the upgrade step is registered
        title = u'Add CSS class blacklist field to registry'
        step = self._get_upgrade_step_by_title(title)
        assert step is not None

        # simulate state on previous version
        from collective.texttospeech.config import DEFAULT_CSS_CLASS_BLACKLIST
        from collective.texttospeech.interfaces import ITextToSpeechControlPanel
        from plone.registry.interfaces import IRegistry
        from zope.component import getUtility
        registry = getUtility(IRegistry)
        record = ITextToSpeechControlPanel.__identifier__ + '.css_class_blacklist'
        del registry.records[record]
        assert record not in registry

        # run the upgrade step to validate the update
        self._do_upgrade(step)
        self.assertIn(record, registry)
        self.assertEqual(registry[record], DEFAULT_CSS_CLASS_BLACKLIST)


class To4TestCase(UpgradeBaseTestCase):

    from_ = '3'
    to_ = '4'

    def test_profile_version(self):
        version = self.setup.getLastVersionForProfile(self.profile_id)[0]
        self.assertEqual(version, self.from_)

    def test_registered_steps(self):
        steps = len(self.setup.listUpgrades(self.profile_id)[0])
        self.assertEqual(steps, 2)
