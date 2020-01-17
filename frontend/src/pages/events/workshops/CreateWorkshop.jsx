import React, {useState} from 'react';
import {Button, Intent} from "@blueprintjs/core";

import {CREATE_WORKSHOP, toWorkshopInput} from 'services/workshops';
import {AdminOnly} from 'services/users';
import {Breadcrumb} from "components/Breadcrumbs";
import {ListEditor} from "components/ListEditor";
import {MutateButton} from "components/widgets/MutateButton";
import {DanceChooser} from "components/widgets/DanceChooser";
import {PropertyEditor, required} from "components/widgets/PropertyEditor";
import {makeTranslate} from 'utils/translate';

const t = makeTranslate({
  create: 'Tallenna',
	dances: 'Tanssit',
	addDance: 'Lisää tanssi',
	name: 'Nimi',
  nameRequired: 'Täytä nimi',
  newWorkshop: 'Uusi työpaja',
});

export default function CreateWorkshopForm({event, uri}) {
  const [workshop, setWorkshop] = useState({
    dances: []
  });
	const setDances = dances => setWorkshop({...workshop, dances});

  return <AdminOnly>
    <Breadcrumb text={t`newWorkshop`} href={uri} />
    <t.h1>newWorkshop</t.h1>
    {t`name`+" "}
    <PropertyEditor property="name" data={workshop} onChange={setWorkshop} validate={required(t`nameRequired`)}/>
    <t.h2>dances</t.h2>
    <ListEditor items={workshop.dances} onChange={setDances}
      component={DanceListItem} />
    <div>
      {t`addDance`+' '}
      <DanceChooser value={null} onChange={dance => setDances([...workshop.dances, dance])} key={workshop.dances.length} />
    </div>
    <MutateButton mutation={CREATE_WORKSHOP} successUrl="../.."
      variables={{eventId: event._id, workshop: toWorkshopInput(workshop)}}
      refetchQueries={['getEvent']}
      text={t`create`} />
  </AdminOnly>;
}

function DanceListItem({item, onChange, onRemove}) {
	return <>
		<DanceChooser value={item} onChange={onChange} />
    <Button intent={Intent.DANGER} text="X" onClick={onRemove} />
	</>;

}
