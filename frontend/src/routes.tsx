import React from 'react'
import {Route, Routes, useParams} from 'react-router-dom'

import {useEvent} from 'services/events'

import {Breadcrumb, Icon} from 'libraries/ui'
import {LoadingState} from 'components/LoadingState'
import Dances from 'pages/dances'
import BallProgram from 'pages/events/BallProgram'
import CreateEvent from 'pages/events/CreateEvent'
import EventList from 'pages/events/EventList'
import EventPage from 'pages/events/EventPage'
import EventProgramPage from 'pages/events/EventProgramPage'
import DanceCheatList from 'pages/events/print/DanceCheatList'
import DanceInstructions from 'pages/events/print/DanceInstructions'
import DanceList from 'pages/events/print/DanceList'
import DanceMastersCheatList from 'pages/events/print/DanceMastersCheatList'
import CreateWorkshopForm from 'pages/events/workshops/CreateWorkshop'
import EditWorkshopForm from 'pages/events/workshops/EditWorkshop'

export default function MainRoutes() {
  return <>
    <Breadcrumb text={<><Icon icon="home" />Tanssiaistietokanta</>} />
    <Routes>
      <Route path="events/new" element={<CreateEvent/>} />
      <Route path="events/:eventId/*" element={<EventRoutes/>} />
      <Route path="dances" element={<Dances/>} />
      <Route path="/" element={<EventList/>} />
    </Routes>
  </>
}

function EventRoutes() {
  const {eventId} = useParams()
  const [event, loadingState] = useEvent(eventId)

  if (!event) return <LoadingState {...loadingState} />

  return <>
    <Breadcrumb text={event.name} />
    <Routes>
      <Route path="/" element={<EventPage event={event}/>} />
      <Route path="program" element={<EventProgramPage event={event}/>} />
      <Route path="ball-program" element={<BallProgram eventId={eventId}/>} />
      <Route path="workshops/create" element={<CreateWorkshopForm event={event}/>} />
      <Route path="workshops/:workshopId" element={<EditWorkshopForm event={event} />} />
      <Route path="print/*" element={<EventPrintRoutes />} />
    </Routes>
  </>
}

function EventPrintRoutes() {
  const {eventId} = useParams()
  return <Routes>
    <Route path="ball-dancelist" element={<DanceList eventId={eventId}/>} />
    <Route path="dance-cheatlist" element={<DanceCheatList eventId={eventId}/>} />
    <Route path="dancemasters-cheatlist" element={<DanceMastersCheatList eventId={eventId}/>} />
    <Route path="dance-instructions" element={<DanceInstructions eventId={eventId} />} />
  </Routes>
}
