# -*- coding: utf-8 -*-
from collective.texttospeech.config import IS_PLONE_5
from collective.texttospeech.logger import logger
from plone import api


JS = '//code.responsivevoice.org/1.5/responsivevoice.js'
EXPRESSION = 'portal/@@texttospeech-helper/enabled'


def update_library_condition(setup_tool):
    """Update the condition used to load ResponsiveVoice library."""
    if IS_PLONE_5:
        return  # upgrade step not supported under Plone 5

    portal_js = api.portal.get_tool('portal_javascripts')
    resource = portal_js.getResource(JS)
    if resource is not None:
        resource.setExpression(EXPRESSION)
        assert resource.getExpression() == EXPRESSION
        logger.info('Condition used to load ResponsiveVoice updated.')
