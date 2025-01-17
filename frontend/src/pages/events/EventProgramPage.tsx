import React from 'react'
import {useNavigate} from 'react-router-dom'
import * as L from 'partial.lenses'

import {useModifyEventProgram} from 'services/events'
import {AdminOnly} from 'services/users'

import {Breadcrumb} from 'libraries/ui'
import {EventProgramEditor} from 'components/EventProgramEditor'
import {EventProgramRow, EventProgramSettings} from 'components/EventProgramEditor/types'
import {PageTitle} from 'components/PageTitle'
import {removeTypenames} from 'utils/removeTypenames'

import {Event} from 'types'

export default function EventProgramEditorPage({event}: {event: Event}) {
  const navigate = useNavigate()
  const [modifyEventProgram] = useModifyEventProgram({
    onCompleted: () => navigate('/events/'+event._id)
  })

  return <AdminOnly fallback="you need to be admin">
    <Breadcrumb text="Tanssiaisohjelma" />
    <PageTitle>Muokkaa tanssiaisohjelmaa</PageTitle>
    <EventProgramEditor
      program={toEventProgramSettings(event.program)}
      onSubmit={(program) => modifyEventProgram({id: event._id, program: toProgramInput(program)})}
    />
  </AdminOnly>
}

function toEventProgramSettings(
  program : Event['program'],
): EventProgramSettings {
  const {introductions = [], danceSets = [], slideStyleId = null} = program ?? {}
  return {
    introductions: { program: introductions, intervalMusicDuration: 0 },
    danceSets,
    slideStyleId
  }
}

function toProgramInput({introductions, danceSets, slideStyleId} : EventProgramSettings) {
  return removeTypenames({
    introductions: introductions.program.map(toIntroductionInput),
    danceSets: L.modify(
      [L.elems, 'program', L.elems], toProgramItemInput, danceSets
    ).map(({isIntroductionsSection, ...d}) => d),
    slideStyleId,
  })
}

function toIntroductionInput({ _id, item: { _id: eventProgramId, ...rest}, slideStyleId}: EventProgramRow) {
  return { _id, eventProgramId, eventProgram: rest, slideStyleId }
}

function toProgramItemInput({_id, slideStyleId, item: {__typename, _id: itemId, ...rest}} : EventProgramRow) {
  switch(__typename) {
    case 'Dance':
    case 'RequestedDance':
      if (!itemId) return {type: 'REQUESTED_DANCE', slideStyleId, _id}
      return {
        _id,
        type: 'DANCE',
        danceId: itemId,
        slideStyleId,
      }
    case 'EventProgram':
      return {
        _id,
        type: 'EVENT_PROGRAM',
        eventProgramId: itemId,
        eventProgram: rest,
        slideStyleId,
      }
    default:
      throw new Error('Unexpected program item type '+__typename)
  }
}
