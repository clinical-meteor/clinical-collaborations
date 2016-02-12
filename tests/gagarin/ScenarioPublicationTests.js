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

  before(function () {
    server.execute(function () {
      // we need to define the collection which we're going to apply the collaboration security model to
      Meteor.startup(function (){
        Studies = new Mongo.Collection('studies');
        Studies.allow({
          insert: function insertStudy (id, doc){
            return true;
          },
          update: function updateStudy (id, doc){
            return true;
          },
          remove: function removeStudy (id, doc){
            return true;
          }
        });
      });

      Meteor.methods({
        addUcscStudy: function () {
          Studies.insert({
            "_id": "ucsctest",
            "cbio_id": Random.id(),
            "name": "Ucsc Test Study",
            "short_name": "satisfaction",
            "description": "Ucsc Test Study",
            "public": false,
            "citation": "unpublished",
            "collaborations": ["ucsc"],
            "tables": [],
            "Questionnaires": [
              "Foo"
            ]
          });
        },
        addUcsfStudy: function () {
          Studies.insert({
            "_id": "ucsftest",
            "cbio_id": Random.id(),
            "name": "Ucsf Test Study",
            "short_name": "satisfaction",
            "description": "Ucsf Test Study",
            "public": false,
            "citation": "unpublished",
            "collaborations": ["ucsf"],
            "tables": [],
            "Questionnaires": [
              "Foo"
            ]
          });
        }
      });
    });
  });
  afterEach(function () {
    server.execute(function () {
      Studies.remove({});
      Collaborations.remove({});
      Meteor.users.remove({});
    });
    // client.execute(function () {
    //   return Studies.find().forEach(function (study) {
    //     Studies.remove({
    //       _id: study._id
    //     });
    //   });
    // });

    // app.execute(function () {
    //   Studies.remove({});
    //   Collaborations.remove({});
    //   Meteor.users.remove({});
    // });
    // browserClient.execute(function () {
    //   return Studies.find().forEach(function (study) {
    //     Studies.remove({
    //       _id: study._id
    //     });
    //   });
    // });
  });

  it('Confirm studies are initialized', function () {
    app.execute(function () {
      Meteor.startup(function (){
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

        var studies = Studies.find().fetch();
        expect(studies.length).to.equal(1);
        expect(studies[0].name).to.equal("Nifty Neuroblastoma Study");
      });
    });
  });
  it('Studies publication/subscription works', function () {
    app.execute(function () {
      Meteor.startup(function (){
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
    });

    client.subscribe('basicStudies');
    var studies = client.collection("studies");
    expect(Object.keys(studies).length).to.equal(3);
    expect(studies.neuroblastoma.name).to.equal("Nifty Neuroblastoma Study");
  });

  // //==================
  // // ALMOST THERE
  // it("Studies publication should filter by collaboration", function () {
  //   app.execute(function () {
  //
  //     // Meteor.call('initializeUsers');
  //     // Meteor.call('initializeSecurityScenarioStudies');
  //     // Meteor.call('initializeDefaultCollaborations');
  //
  //     // var adminUser = Meteor.users.findOne({username: "cuddy"});
  //     // expect(adminUser.username).to.equal('cuddy');
  //
  //     Meteor.publish('wcdtStudies', function () {
  //       var adminUser = Meteor.users.findOne({
  //         username: "chase"
  //       });
  //       return Studies.find({
  //         collaborations: {
  //           $in: adminUser.getAssociatedCollaborations()
  //         }
  //       });
  //     });
  //   });
  //
  //   // subscribe to getStudies publication and wait for the ready message
  //   client.subscribe('wcdtStudies');
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
