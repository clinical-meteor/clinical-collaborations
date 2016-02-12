  // // The following two tests are collection specific (Studies and Questionnaires)
  // // They should be moved into Studies/Questionnaire packages.
  // // More specifically, they need to rewritten using a generic Record schema of some sort
  // // Or used in an application baseline test
  //
  // it('User.getCollaborationStudies() - Camron has access to UCSF and WCDT studies.', function () {
  //   return server.wait(500, "until users is found", function () {
  //     return Meteor.users.findOne({username: "camron"}).getCollaborationStudies();
  //   }).then(function (studies){
  //     // expected studies
  //     expect(studies).to.include("lymphoma");
  //     expect(studies).to.include("granuloma");
  //     expect(studies).to.include("satisfaction");
  //
  //     // denied studies
  //     expect(studies).to.not.include("neuroblastoma");
  //     expect(studies).to.not.include("melanoma");
  //     expect(studies).to.not.include("sarcoma");
  //     expect(studies).to.not.include("carcinoma");
  //   });
  // });
  // it('User.getCollaborationQuestionnaires() - Camron has access to UCSF and WCDT questionnaires.', function () {
  //   return server.wait(500, "until users is found", function () {
  //     return Meteor.users.findOne({username: "camron"});
  //   }).then(function (user){
  //     user = new User(user);
  //
  //     var studies = user.getCollaborationStudies();
  //     var questionnaires = [];
  //     studies.forEach(function (study){
  //       questionnaires.push(study.getQuestionnaires());
  //     });
  //     // expected questionnaires
  //     expect(questionnaires).to.include("Followup");
  //     expect(questionnaires).to.include("Demographics");
  //     expect(questionnaires).to.include("Patient_Enrollment_form");
  //     expect(questionnaires).to.include("Blood_Labs_V2");
  //     expect(questionnaires).to.include("Patient_Satisfaction");
  //
  //     // denied questionnaires
  //     expect(questionnaires).to.include("Followup");
  //     expect(questionnaires).to.include("Demographics");
  //     expect(questionnaires).to.include("Patient_Enrollment_form");
  //     expect(questionnaires).to.include("Blood_Labs_V2");
  //     expect(questionnaires).to.include("Patient_Satisfaction");
  //   });
  // });
