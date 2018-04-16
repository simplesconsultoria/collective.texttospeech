Changelog
=========

1.1 (unreleased)
----------------

- Drop support for Plone 5.0.
  [hvelarde]

- Pin version of Products.ResourceRegistries >=2.2.12 to fix upgrade step.
  [rodfersou, hvelarde]


1.0rc1 (2016-07-11)
-------------------

- Ignore ``<iframe>`` tags explicitly and fix button visibility.
  [rodfersou]

- Show the 'Listen' button to anonymous users only.
  [hvelarde]


1.0b2 (2016-07-08)
------------------

- Review text extraction logic;
  it is now possible to ignore parts of the text via a blacklist of CSS classes accessible in the control panel configlet.
  [rodfersou, hvelarde]

- To avoid displaying the 'Listen' button with an incorrect voice,
  the feature is now globally disabled by default at installation time.
  [hvelarde]

- ResponsiveVoice library is now only loaded when needed.
  [hvelarde]

- The 'Listen' button is now shown only after ResponsiveVoice library has been loaded.
  [rodfersou]


1.0b1 (2016-06-14)
------------------

- Use version 1.4 of the ResponsiveVoice API.
  [hvelarde]

- Package is now compatible with Plone 5.0 and Plone 5.1.
  [rodfersou, hvelarde]

- Implement i18n on the widget and update translations.
  [rodfersou, hvelarde]

- Simplify static files stack.
  [rodfersou]


1.0a2 (2016-03-28)
------------------

- Add Brazilian Portuguese and Spanish translations.
  [hvelarde]

- Fix an issue with package JavaScript.
  [rodfersou]


1.0a1 (2016-03-28)
------------------

- Initial release.
