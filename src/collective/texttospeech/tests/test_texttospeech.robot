*** Settings ***

Resource  plone/app/robotframework/keywords.robot
Variables  plone/app/testing/interfaces.py
Library  Remote  ${PLONE_URL}/RobotRemote

Suite Setup  Open Test Browser
Suite Teardown  Close all browsers

*** Variables ***

${CONFIGLET_URL}  ${PLONE_URL}/@@texttospeech-settings
${TEST_DOC_URL}  ${PLONE_URL}/test
${globally_enabled_selector}  input#form-widgets-globally_enabled-0
${viewlet_button_selector}  div#viewlet-texttospeech > button

*** Test cases ***

Test Text-To-Speech
    Enable Autologin as  Site Administrator

    # open the configlet and enable the feature
    Go to  ${CONFIGLET_URL}
    Page Should Contain  Enable Text-to-Speech?
    Select Checkbox  css=${globally_enabled_selector}
    Click Button  Save
    Page Should Contain  Changes saved

    # the button must be visible to logged in users
    Go to  ${TEST_DOC_URL}
    Wait Until Element Is Visible  css=${viewlet_button_selector}

    # the button must be visible to anonymous users
    Disable Autologin
    Go to  ${TEST_DOC_URL}
    Wait Until Element Is Visible  css=${viewlet_button_selector}

    # test the reader
    Click Button  Listen
    Sleep  5  Wait for ResponsiveVoice to read the text

    # TODO: test interaction with the reader
