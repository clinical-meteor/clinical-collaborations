Meteor.publish('collaborations', function () {
  if (this.userId === null){
    var user = Meteor.users.findOne({_id: this.userId});

    if (user) {
      if (user.profile) {
        if (user.profile.collaborations) {

          // return the user's private collaborations and any public collaborations
          return Collaborations.find(
            {$or: [
              {isUnlisted: false}, // allows people to join
              {$and:
                [
                  {isUnlisted: true}, // here to show the true branch
                  {$or: [
                    {collaborators: {$in: user.profile.collaborations}},
                    {administrators: {$in: user.profile.collaborations}},
                    {collaborators: {$in: getEmailsForId(this.userId)}},
                    {administrators: {$in: getEmailsForId(this.userId)}}
                  ]}
                ]
              }
            ]});
        } else {
          // couldn't find the user's collaborations, so only show the public ones
          return Collaborations.find( {isUnlisted: false} );
        }
      } else {
          // couldn't find the user's collaborations, so only show the public ones
        return Collaborations.find( {isUnlisted: false} );
      }
    } else {
          // couldn't find the user's collaborations, so only show the public ones
      return Collaborations.find( {isUnlisted: false} );
    }
  } else {
    // couldn't find the user's collaborations, so only show the public ones
    return Collaborations.find( {isUnlisted: false} );
  }

});
