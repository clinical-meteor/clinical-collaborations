describe("clinical:collaborations - collaboration scenario", function () {
  var server = meteor();
  var app = meteor({
    flavor: "fiber"
  });
  var client = ddp(app, {
    flavor: "fiber"
  });
  var browserClient = browser({
    flavor: "fiber",
    location: app
  });

  afterEach(function () {
    server.execute(function () {
      Studies.remove({});
      Collaborations.remove({});
      Meteor.users.remove({});
    });
  });

  it('publication/subscription works', function () {
    app.execute(function () {
      if (typeof Studies === "undefined") {
        var Studies = new Mongo.Collection('studies');
      }
      if (Studies.find().count() === 0) {
        Studies.upsert({
          _id: "neuroblastoma"
        }, {
          $set: {
            "cbio_id": "112",
            "name": "Nifty Neuroblastoma Study",
            "short_name": "neuroblastoma",
            "description": "Nifty Neuroblastoma Study",
            "public": false,
            "citation": "unpublished",
            "collaborations": ["ckcc"],
            "tables": [],
            "Questionnaires": [
              "Patient_Enrollment_form",
              "RNASeq_completion_form",
              "Followup"
            ]
          }
        });
      }
      Meteor.publish('basicStudies', function () {
        return Studies.find();
      });
    });

    client.subscribe('basicStudies');
    var studies = client.collection("studies");
    expect(Object.keys(studies).length).to.equal(1);
    expect(studies.neuroblastoma.name).to.equal("Nifty Neuroblastoma Study");
  });

  // //==================
  // // SECURITY SCENARIO
  // it("Studies publication should filter by collaboration", function () {
  //   app.execute(function () {
  //
  //     // Meteor.call('initializeUsers');
  //     // Meteor.call('initializeSecurityScenarioStudies');
  //     // Meteor.call('initializeDefaultCollaborations');
  //
  //     // ============================================================================
  //     // INITIALIZE USERS
  //     var userId = null;
  //
  //     userId = Accounts.createUser({
  //       username: 'house',
  //       password: 'house',
  //       email: 'house@test.org',
  //       profile: {
  //         fullName: 'Gregory House',
  //         role: 'Physician',
  //         avatar: '/packages/clinical_accounts-housemd/housemd/gregory.house.jpg'
  //       }
  //     });
  //
  //     userId = Accounts.createUser({
  //       username: 'camron',
  //       password: 'camron',
  //       email: 'camron@test.org',
  //       profile: {
  //         fullName: 'Test User',
  //         role: 'Physician',
  //         avatar: '/packages/clinical_accounts-housemd/housemd/allison.camron.jpg'
  //       }
  //     });
  //
  //     userId = Accounts.createUser({
  //       username: 'foreman',
  //       password: 'foreman',
  //       email: 'foreman@test.org',
  //       profile: {
  //         fullName: 'Eric Foreman',
  //         role: 'Physician',
  //         avatar: '/packages/clinical_accounts-housemd/housemd/eric.foreman.jpg'
  //       }
  //     });
  //
  //     userId = Accounts.createUser({
  //       username: 'wilson',
  //       password: 'wilson',
  //       email: 'wilson@test.org',
  //       profile: {
  //         fullName: 'James Wilson',
  //         role: 'Physician',
  //         avatar: '/packages/clinical_accounts-housemd/housemd/james.wilson.jpg'
  //       }
  //     });
  //
  //     userId = Accounts.createUser({
  //       username: 'kutner',
  //       password: 'kutner',
  //       email: 'kutner@test.org',
  //       profile: {
  //         fullName: 'Lawrence Kutner',
  //         role: 'Physician',
  //         avatar: '/packages/clinical_accounts-housemd/housemd/lawrence.kutner.jpg'
  //       }
  //     });
  //
  //     userId = Accounts.createUser({
  //       username: 'cuddy',
  //       password: 'cuddy',
  //       email: 'cuddy@test.org',
  //       profile: {
  //         fullName: 'Lisa Cuddy',
  //         role: 'Physician',
  //         avatar: '/packages/clinical_accounts-housemd/housemd/lisa.cuddy.jpg',
  //         collaborations: [
  //           "wcdt"
  //         ]
  //       }
  //     });
  //
  //     userId = Accounts.createUser({
  //       username: 'chase',
  //       password: 'chase',
  //       email: 'chase@test.org',
  //       profile: {
  //         fullName: 'Robert Chase',
  //         role: 'Physician',
  //         avatar: '/packages/clinical_accounts-housemd/housemd/robert.chase.jpg',
  //         collaborations: [
  //           "genomics"
  //         ]
  //       }
  //     });
  //
  //     userId = Accounts.createUser({
  //       username: 'thirteen',
  //       password: 'thirteen',
  //       email: 'thirteen@test.org',
  //       profile: {
  //         fullName: 'Thirteen',
  //         role: 'Physician',
  //         avatar: '/packages/clinical_accounts-housemd/housemd/thirteen.jpg'
  //       }
  //     });
  //
  //     var adminUser = Meteor.users.findOne({username: "cuddy"});
  //     expect(adminUser.username).to.equal('cuddy');
  //     expect(adminUser.getAssociatedCollaborations().length).to.equal(1);
  //
  //     var adminUser = Meteor.users.findOne({username: "chase"});
  //     expect(adminUser.username).to.equal('chase');
  //     expect(adminUser.getAssociatedCollaborations().length).to.equal(3);
  //
  //     // ============================================================================
  //     // INITIALIZE COLLABORATIONS
  //
  //     Collaborations.insert({
  //       _id: "ckcc",
  //       isUnlisted: false,
  //       name: "California Kids Cancer Comparison",
  //       description: "",
  //       collaborators: ["thirteen@test.org", "kutner@test.org"],
  //       administrators: ["thirteen@test.org"],
  //       invitations: [],
  //       requests: [],
  //       requiresAdministratorApprovalToJoin: false
  //     });
  //
  //     Collaborations.insert({
  //       _id: "wcdt",
  //       isUnlisted: false,
  //       name: "West Coast Dream Team",
  //       description: "",
  //       collaborators: ["cuddy@test.org"],
  //       administrators: ["cuddy@test.org"],
  //       invitations: [],
  //       requests: [],
  //       requiresAdministratorApprovalToJoin: false
  //     });
  //
  //     Collaborations.insert({
  //       _id: "ucsc",
  //       isUnlisted: false,
  //       name: "UC Santa Cruz",
  //       description: "",
  //       collaborators: ["foreman@test.org", "wcdt"],
  //       administrators: ["foreman@test.org"],
  //       invitations: [],
  //       requests: [],
  //       requiresAdministratorApprovalToJoin: false
  //     });
  //
  //     Collaborations.insert({
  //       _id: "genomics",
  //       isUnlisted: false,
  //       name: "Cancer Genomics",
  //       description: "",
  //       collaborators: ["kutner@test.org", "chase@test.org", "ucsc"],
  //       administrators: ["kutner@test.org"],
  //       invitations: [],
  //       requests: [],
  //       requiresAdministratorApprovalToJoin: false
  //     });
  //
  //     Collaborations.insert({
  //       _id: "ucsf",
  //       isUnlisted: false,
  //       name: "UC San Francisco",
  //       description: "",
  //       collaborators: ["camron@test.org", "house@test.org", "wcdt"],
  //       administrators: ["house@test.org"],
  //       invitations: [],
  //       requests: [],
  //       requiresAdministratorApprovalToJoin: false
  //     });
  //
  //     Collaborations.insert({
  //       _id: "ucla",
  //       isUnlisted: false,
  //       name: "UC Los Angeles Francisco",
  //       description: "",
  //       collaborators: ["wilson@test.org", "wcdt"],
  //       administrators: ["wilson@test.org"],
  //       invitations: [],
  //       requests: [],
  //       requiresAdministratorApprovalToJoin: false
  //     });
  //
  //     // ============================================================================
  //     // INITIALIZE STUDIES
  //     var Studies = new Mongo.Collection('studies');
  //
  //
  //     Studies.upsert({
  //       _id: "neuroblastoma"
  //     }, {
  //       $set: {
  //         "cbio_id": "112",
  //         "name": "Nifty Neuroblastoma Study",
  //         "short_name": "neuroblastoma",
  //         "description": "Nifty Neuroblastoma Study",
  //         "public": false,
  //         "citation": "unpublished",
  //         "collaborations": ["ckcc"],
  //         "tables": [],
  //         "Questionnaires": [
  //           "Patient_Enrollment_form",
  //           "RNASeq_completion_form",
  //           "Followup"
  //         ]
  //       }
  //     });
  //     Studies.upsert({
  //       _id: "lymphoma"
  //     }, {
  //       $set: {
  //         "cbio_id": "112",
  //         "name": "Lazy Lymphoma Study",
  //         "short_name": "lymphoma",
  //         "description": "Lazy Lymphoma Study",
  //         "public": false,
  //         "citation": "unpublished",
  //         "collaborations": ["ucsf"],
  //         "tables": [],
  //         "Questionnaires": [
  //           "Demographics",
  //           "Followup"
  //         ]
  //       }
  //     });
  //     Studies.upsert({
  //       _id: "granuloma"
  //     }, {
  //       $set: {
  //         "cbio_id": "112",
  //         "name": "Grumpy Granuloma Study",
  //         "short_name": "granuloma",
  //         "description": "Grumpy Granuloma Study",
  //         "public": false,
  //         "citation": "unpublished",
  //         "collaborations": ["ucsf"],
  //         "tables": [],
  //         "Questionnaires": [
  //           "Patient_Enrollment_form",
  //           "Blood_Labs_V2",
  //           "Followup"
  //         ]
  //       }
  //     });
  //
  //
  //     Studies.upsert({
  //       _id: "carcinoma"
  //     }, {
  //       $set: {
  //         "cbio_id": "112",
  //         "name": "Cranky Carcinoma Study",
  //         "short_name": "carcinoma",
  //         "description": "Cranky Carcinoma Study",
  //         "public": false,
  //         "citation": "unpublished",
  //         "collaborations": ["genomics"],
  //         "tables": [],
  //         "Questionnaires": [
  //           "RNASeq_completion_form",
  //           "Followup"
  //         ]
  //       }
  //     });
  //     Studies.upsert({
  //       _id: "melanoma"
  //     }, {
  //       $set: {
  //         "cbio_id": "112",
  //         "name": "Meloncholy Melanoma Study",
  //         "short_name": "melanoma",
  //         "description": "Meloncholy Melanoma Study",
  //         "public": false,
  //         "citation": "unpublished",
  //         "collaborations": ["ucla"],
  //         "tables": [],
  //         "Questionnaires": [
  //           "RNASeq_completion_form",
  //           "Followup"
  //         ]
  //       }
  //     });
  //     Studies.upsert({
  //       _id: "sarcoma"
  //     }, {
  //       $set: {
  //         "cbio_id": "112",
  //         "name": "Sappy Sarcoma Study",
  //         "short_name": "sarcoma",
  //         "description": "Sappy Sarcoma Study",
  //         "public": false,
  //         "citation": "unpublished",
  //         "collaborations": ["ucsc"],
  //         "tables": [],
  //         "Questionnaires": [
  //           "Laser_Capture_Microdissection",
  //           "Followup"
  //         ]
  //       }
  //     });
  //
  //     Studies.upsert({
  //       _id: "satisfaction"
  //     }, {
  //       $set: {
  //         "cbio_id": "112",
  //         "name": "Patient Satisfaction Study",
  //         "short_name": "satisfaction",
  //         "description": "Patient Satisfaction Study",
  //         "public": false,
  //         "citation": "unpublished",
  //         "collaborations": ["wcdt"],
  //         "tables": [],
  //         "Questionnaires": [
  //           "Patient_Satisfaction"
  //         ]
  //       }
  //     });
  //
  //
  //
  //     Meteor.publish('studies', function () {
  //       var adminUser = Meteor.users.findOne({
  //         username: "chase"
  //       });
  //       return Studies.find({
  //         collaborations: {
  //           $in: adminUser.getAssociatedCollaborations()
  //         }
  //       });
  //     });
  //     Meteor.methods({
  //       addUcscStudy: function () {
  //         Studies.insert({
  //           "_id": "ucsctest",
  //           "cbio_id": Random.id(),
  //           "name": "Ucsc Test Study",
  //           "short_name": "satisfaction",
  //           "description": "Ucsc Test Study",
  //           "public": false,
  //           "citation": "unpublished",
  //           "collaborations": ["ucsc"],
  //           "tables": [],
  //           "Questionnaires": [
  //             "Foo"
  //           ]
  //         });
  //       },
  //       addUcsfStudy: function () {
  //         Studies.insert({
  //           "_id": "ucsftest",
  //           "cbio_id": Random.id(),
  //           "name": "Ucsf Test Study",
  //           "short_name": "satisfaction",
  //           "description": "Ucsf Test Study",
  //           "public": false,
  //           "citation": "unpublished",
  //           "collaborations": ["ucsf"],
  //           "tables": [],
  //           "Questionnaires": [
  //             "Foo"
  //           ]
  //         });
  //       }
  //     });
  //
  //
  //   });
  //
  //   // subscribe to getStudies publication and wait for the ready message
  //   client.subscribe('studies');
  //   var studies = client.collection("studies");
  //   expect(Object.keys(studies).length).to.equal(3);
  //   expect(studies.carcinoma.name).to.equal("Cranky Carcinoma Study");
  //   expect(studies.sarcoma.name).to.equal("Sappy Sarcoma Study");
  //   expect(studies.satisfaction.name).to.equal("Patient Satisfaction Study");
  //
  //   expect(studies.neuroblastoma).to.not.exist;
  //   expect(studies.lymphoma).to.not.exist;
  //   expect(studies.granuloma).to.not.exist;
  //   expect(studies.melanoma).to.not.exist;
  //
  //   // add a new post
  //   client.call('addUcsfStudy');
  //   // wait until new data comes to the client
  //   client.sleep(200);
  //
  //   // check the new data arrived or not
  //   studies = client.collection("studies");
  //   expect(Object.keys(studies).length).to.equal(3);
  //   expect(studies.carcinoma.name).to.equal("Cranky Carcinoma Study");
  //   expect(studies.sarcoma.name).to.equal("Sappy Sarcoma Study");
  //   expect(studies.satisfaction.name).to.equal("Patient Satisfaction Study");
  //
  //   expect(studies.ucsftest).to.not.exist;
  //   expect(studies.neuroblastoma).to.not.exist;
  //   expect(studies.lymphoma).to.not.exist;
  //   expect(studies.granuloma).to.not.exist;
  //   expect(studies.melanoma).to.not.exist;
  //
  //   // add a new post
  //   client.call('addUcscStudy');
  //   // wait until new data comes to the client
  //   client.sleep(200);
  //
  //   // check the new data arrived or not
  //   studies = client.collection("studies");
  //   expect(Object.keys(studies).length).to.equal(4);
  //   expect(studies.carcinoma.name).to.equal("Cranky Carcinoma Study");
  //   expect(studies.sarcoma.name).to.equal("Sappy Sarcoma Study");
  //   expect(studies.satisfaction.name).to.equal("Patient Satisfaction Study");
  //   expect(studies.ucsctest.name).to.equal("Ucsc Test Study");
  //
  //   expect(studies.ucsftest).to.not.exist;
  //   expect(studies.neuroblastoma).to.not.exist;
  //   expect(studies.lymphoma).to.not.exist;
  //   expect(studies.granuloma).to.not.exist;
  //   expect(studies.melanoma).to.not.exist;
  // });



});
