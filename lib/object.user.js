




/**
 * @summary Whether the person is associated with a collaboration.  Helps in determining if an account is newly created, a patient, research subject, or member of a clinical collaboration.  An account that is a member of a collaboration will typically have more access, but will have regulatory oversite and auditing (i.e. subject to HIPAA tracking and auditing).
 * @memberOf User
 * @name isMemberOfAnyCollaboration
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * if(selectedUser.isMemberOfAnyCollaboration()){
 *   Hipaa.logEntry('A team collaborator did something that requires logging.')
 * } else {
 *   Router.go('/path/to/collaboration/signup');
 * };
 * ```
 */

User.prototype.isMemberOfAnyCollaboration = function (){
  if (this.profile && this.profile.collaborations && this.profile.collaborations.length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * @summary Whether the person is associated with a collaboration or a new user.
 * @memberOf User
 * @name hasNoCollaborations
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * if(selectedUser.hasNoCollaborations()){
 *   Router.go('/path/to/collaboration/signup');
 * };
 * ```
 */
User.prototype.hasNoCollaborations = function (){
  if (this.profile && (this.profile.collaborations === undefined) || (this.profile.collaborations.length === 0)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @summary Determines if a user is associated with a specific collaboration.
 * @memberOf User
 * @name isMemberOfCollaboration
 * @param collaborationId The MongoId of the collaboration.
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * if(selectedUser.hasNoCollaborations()){
 *   Router.go('/path/to/collaboration/signup');
 * };
 * ```
 */
User.prototype.isMemberOfCollaboration = function (collaborationId){
  var result = false;

  var specifiedCollaboration = Collaborations.findOne({_id: collaborationId});

  if (specifiedCollaboration.hasMember(this.defaultEmail())) {
    return true;
  } else {
    return false;
  }
};

/**
 * @summary Gets an array of all the collaborations that a user is associated with.
 * @memberOf User
 * @name getCollaborations
 * @version 1.2.3
 * @returns {Array}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * selectedUser.getCollaborations().forEach(function(collaboration){
 *   console.log(collaboration.name);
 * });
 * ```
 */
User.prototype.getCollaborations = function () {

  var result = [];

  if (this) {
    if (this.profile) {
      if (this.profile.collaborations) {
        var collaboratorsIncludeSelf = false;
        this.profile.collaborations.forEach(function(collaborator){
          result.push(collaborator);
          //if((collaborator === this.username) || (collaborator === this.defaultEmail())){
          if(collaborator === this.username){
            collaboratorsIncludeSelf = true;
          }
        });
        if(!collaboratorsIncludeSelf){
          result.push(this.username);
        }
      } else {
        return [];
      }
    } else {
      return [];
    }
  } else {
    return [];
  }

  return result;
};


/**
 * @summary Parses the collaborations graph, and returns a list of all collaborations that a user has reciprical access to.  Uses a transitive closure algorithm to walk the collaboration graph.
 * @locus Server
 * @memberOf User
 * @name getAllCollaborations
 * @version 1.2.3
 * @returns {Array}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * selectedUser.getAllCollaborations().forEach(function(collaborationName){
 *   console.log(collaborationNamplae);
 * });
 * ```
 */
User.prototype.getAssociatedCollaborations = function () {
  process.env.DEBUG && console.log('getAllCollaborations', JSON.stringify(this));


  var result = [];

  // start by adding our username to the results
  result.push(this.username);

  if (this) {
    if (this.profile) {
      if (this.profile.collaborations) {
        // now start parsing the existing collaborations
        var collaborationLookupQueue = this.profile.collaborations;

        // look through each of the collaborations in our profile
        for (var i = 0; i < collaborationLookupQueue.length; i++) {
          // and pop it into a variable

          Collaborations.find({
            _id: collaborationLookupQueue[i]
          }).forEach(function (collaboration) {
            if (result.indexOf(collaboration._id) === -1){
              result.push(collaboration._id);
            }
            if (collaboration.collaborators) {
              // iterate through all the collaborators
              collaboration.collaborators.forEach(function (collaborator){

                // parse whether they're nodes or leaves
                if (collaborator.indexOf("@") === -1) {
                  // add nodes to our queue
                  collaborationLookupQueue.push(collaborator);
                  if (result.indexOf(collaborator) === -1){
                    result.push(collaborator);
                  }
                }
              });
            }
          });
        }
      } else {
        return [];
      }
    } else {
      return [];
    }
  } else {
    return [];
  }

  return result;
  // return Object.keys(collaborationSet).sort();
};



if (Meteor.isServer) {

  /**
   * @summary Makes sure the user account is synchronized with the current User model.  Basically a save() function for collaborations.
   * @locus Anywhere
   * @memberOf User
   * @name syncCollaborations
   * @version 1.2.3
   * @example
   * ```js
   * var selectedUser = Meteor.users.findOne({username: "janedoe"});
   * selectedUser.syncCollaborations();
   * ```
   */
  User.prototype.syncCollaborations = function () {
    Meteor.users.update(this._id, {
      $set: {
        "profile.collaborations": this.getAllCollaborations()
      }
    });
  };



}
