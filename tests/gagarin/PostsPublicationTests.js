describe("clinical:collaborations - publication/subscriptions", function () {
  var app = meteor({
    flavor: "fiber"
  });
  var client = ddp(app, {
    flavor: "fiber"
  });
  var browserClient = browser({flavor: "fiber", location: app});
  var server = meteor();

  before(function (){
    app.execute(function (){
      Meteor.methods({
        addStudy: function () {
          Studies.insert({
            name: Random.id()
          });
        }
      });
    });
  });
  afterEach(function (){
    app.execute(function (){
      Studies.remove({});
      Collaborations.remove({});
      Meteor.users.remove({});
    });
    browserClient.execute(function (){
      return Studies.find().forEach(function (study){
        Studies.remove({_id: study._id});
      });
    });
  });

  it('Confirm studies are initialized', function () {
    return server.wait(1000, "until studies are loaded", function () {


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

      return Studies.find().fetch();
    }).then(function (studies) {
      expect(studies.length).to.equal(1);
    });
  });
  it('Studies publication/subscription works', function () {
    return server.wait(1000, "until studies are loaded", function () {

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
      return Studies.find().fetch();
    }).then(function (studies) {
      expect(studies.length).to.equal(1);
    });
  });

  // it("ddp connection should be established", function () {
  //   app.execute(function () {
  //
  //     Meteor.call('initializeSecurityScenarioStudies');
  //     Meteor.call('initializeDefaultCollaborations');
  //
  //     Meteor.publish('getStudies', function () {
  //       return Studies.find();
  //     });
  //   });
  //
  //   // subscribe to getStudies publication and wait for the ready message
  //   client.subscribe('getStudies');
  //   var studies = client.collection("studies");
  //   expect(Object.keys(studies).length).to.equal(7);
  //
  //   // foo.promise(function (){
  //   //   Studies.remove({});
  //   // });
  // });
  // it("adding study updates client cursor", function () {
  //   app.execute(function () {
  //
  //     Meteor.call('initializeSecurityScenarioStudies');
  //     Meteor.call('initializeDefaultCollaborations');
  //
  //     Meteor.publish('getStudies', function () {
  //       return Studies.find();
  //     });
  //
  //   });
  //
  //   // subscribe to getStudies publication and wait for the ready message
  //   client.subscribe('getStudies');
  //   var studies = client.collection("studies");
  //   expect(Object.keys(studies).length).to.equal(7);
  //
  //   // add a new post
  //   client.call('addStudy');
  //   // wait until new data comes to the client
  //   client.sleep(200);
  //
  //   // check the new data arrived or not
  //   studies = client.collection("studies");
  //   expect(Object.keys(studies).length).to.equal(8);
  //
  //   // studies.find().forEach(function (study){
  //   //   Studies.remove({_id: study._id});
  //   // });
  // });


  //==================
  // ALMOST THERE
  it("studies publication should filter by collaboration", function () {
    app.execute(function () {

      Meteor.call('initializeUsers');
      Meteor.call('initializeSecurityScenarioStudies');
      Meteor.call('initializeDefaultCollaborations');

      // var adminUser = Meteor.users.findOne({username: "cuddy"});
      // expect(adminUser.username).to.equal('cuddy');

      Meteor.publish('wcdtStudies', function () {
        var adminUser = Meteor.users.findOne({username: "cuddy"});
        return Studies.find({
          collaborations: {$in: adminUser.getCollaborations()}
        });
      });

    });

    // subscribe to getStudies publication and wait for the ready message
    client.subscribe('wcdtStudies');
    var studies = client.collection("studies");
    expect(Object.keys(studies).length).to.equal(1);

    // add a new post
    client.call('addStudy');
    // wait until new data comes to the client
    client.sleep(200);

    // check the new data arrived or not
    studies = client.collection("studies");
    expect(Object.keys(studies).length).to.equal(1);
  });

  //==================
  // Users Check
  it("users publication should send account info to client", function () {
    app.execute(function () {

      Meteor.call('initializeUsers');
      Meteor.call('initializeSecurityScenarioStudies');
      Meteor.call('initializeDefaultCollaborations');

      // var adminUser = Meteor.users.findOne("cuddy");
      // expect(adminUser.username).to.equal('cuddy');

      Meteor.publish('currentUsers', function () {
        return Meteor.users.find();
      });
    });

    // subscribe to getStudies publication and wait for the ready message
    client.subscribe('currentUsers');
    var users = client.collection("users");
    expect(Object.keys(users).length).to.equal(8);
  });


});
