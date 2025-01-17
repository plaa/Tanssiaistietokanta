module.exports = (app) => {
  const service = app.service('dances')
  const workshopService = app.service('workshops')

  function findTeachedIn(obj, {eventId}) {
    return workshopService.find({
      query: eventId ?
        {danceIds: obj._id, eventId} :
        {danceIds: obj._id}
    })
  }

  return {
    Dance: {
      teachedIn: findTeachedIn
    },
    Query: {
      dances: (_, __, params) => service.find(params)
    },
    Mutation: {
      createDance: (_, {dance}, params) => service.create(dance, params),
      modifyDance: (_, {id, dance}, params) => service.update(id, dance, params),
      patchDance: (_, {id, dance}, params) => service.patch(id, dance, params),
      deleteDance: (_, {id}, params) => service.remove(id, params)
    }
  }
}
