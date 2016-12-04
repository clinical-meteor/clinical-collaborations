
Package.describe({
  name: 'clinical:collaborations',
  version: '2.4.0',
  summary: 'Collaboration based security architecture (similar to Roles and Friends)',
  git: 'https://github.com/clinical-meteor/clinical-collaborations',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');

  api.use([
    'mongo@1.1.0',
    'accounts-base@1.2.14',
    'accounts-password@1.3.3',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.5.0',
    'http@1.1.8',
    'underscore@1.0.10',
    'yasaricli:slugify@0.0.7',
    'clinical:base-model@1.3.5',
    'matb33:collection-hooks@0.8.1',
    'clinical:user-model@1.6.0'
  ], ['client', 'server']);

  api.imply('accounts-base@1.2.14');
  api.imply('accounts-password@1.3.3');
  api.imply('clinical:user-model@1.6.0');

  api.addFiles([
    'client/subscriptions.js',
  ], ['client']);

  api.addFiles([
    'lib/collection.collaborations.js',
    'lib/object.collaboration.js',
    'lib/object.user.js',
    'lib/extentions.js'
  ]);

  api.addFiles([
    'server/accounts.js',
    'server/methods.js',
    'server/publications.js'
  ], ['server']);


  api.export([
    'Schemas',
    'Collaborations',
    'Collaboration'
  ]);
});
