import React, {useState, useEffect} from 'react';
import {usePatchDance, Dance} from "services/dances";
import {MarkdownEditor} from 'components/MarkdownEditor';
import {Button, FormGroup, Tag, ProgressBar} from "libraries/ui";
import {Form, Input, SubmitButton} from "libraries/forms";
import {getDanceData} from 'libraries/danceWiki';
import {Dialog} from 'libraries/dialog';
import {useOnChangeForProp} from 'utils/useOnChangeForProp';
import {DanceNameSearch} from './DanceNameSearch';

interface DanceDataImportButtonProps {
  onImport?: (dance: Dance) => any,
  dance: Dance,
  text: string,
}

export function DanceDataImportButton({onImport, dance, text, ...props} : DanceDataImportButtonProps) {
  const [isOpen, setOpen] = useState(false);

  const [patch] = usePatchDance();
  const handleImport = (data ) => {
    if (onImport) {
      onImport(data)
      return
    }
    const {_id, category, formation, instructions} = data
    patch({
      _id, category, formation, instructions,
    })
  }

  return <>
    <Button text={text} {...props} onClick={() => setOpen(true)} />
    <DanceDataImportDialog isOpen={isOpen} onClose={() => setOpen(false)}
      dance={dance} onImport={(data) => { setOpen(false); handleImport(data); }}
    />
  </>
}

export function DanceDataImportDialog({dance: originalDance, isOpen, onClose, onImport}) {
  const [importedData, setImportedData] = useState(null);
  const [dance, setDance] = useState(originalDance);

  function reset() {
    setDance(originalDance);
    setImportedData(null);
  }
  useEffect(reset, [originalDance]);

  function importDone(data) {
    if (data.instructions && (!dance.instructions || dance.instructions.trim() === '')) {
      setDance({...dance, instructions: data.instructions});
    }
    setImportedData(data);
  }
  function save() {
    onImport(dance); reset();
  }
  function close() {
    onClose(); reset();
  }

  return <Dialog isOpen={isOpen} onClose={close} title="Hae tanssin tietoja tanssiwikistä"
    style={{minWidth: 500, width: 'auto', maxWidth: '80%'}}>
    <Form onSubmit={save}>
      <Dialog.Body>
        <DataImporter danceName={dance.name} onImport={importDone} />
        {importedData &&
            <ImportedDataView importedData={importedData} dance={dance} setDance={setDance} />}
      </Dialog.Body>
      <Dialog.Footer>
        <Button text="Peruuta" onClick={close} />
        <SubmitButton text="Tallenna" disabled={!importedData}/>
      </Dialog.Footer>
    </Form>
  </Dialog>;
}

function DataImporter({danceName, onImport}) {
  const [search, setSearch] = useState(danceName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string} | null>(null);

  function importData() {
    setLoading(true);
    getDanceData(search)
      .then(onImport)
      .catch(setError)
      .finally(() => setLoading(false));
  }

  return <FormGroup label="Hae tanssi nimellä" inline>
    <DanceNameSearch value={search} onChange={setSearch} />
    <Button icon="search" intent="primary" onClick={importData} disabled={loading}/>
    {loading
        ? <div style={{margin: "10px 0px"}}>Ladataan tietoja...<ProgressBar /></div>
        : <p>Hae tietoja hakunapilla, jotta voit liittää niitä tietokantaan</p>}
    {error && <p>{error.message}</p>}
  </FormGroup>;
}

function ImportedDataView({dance, setDance, importedData}) {
  const onChangeFor = useOnChangeForProp(setDance);
  //const [instructions, setInstructions] = useState(importedData.instructions ?? '');

  return <>
    <Row>
      <RowItem>
        <Input label="Kategoria" value={dance.category ?? ""} onChange={onChangeFor('category')} />
      </RowItem>
      <RowItem>
        <Suggestions values={importedData.categories} onSuggest={onChangeFor('category')} />
      </RowItem>
    </Row>
    <Row>
      <RowItem>
        <Input label="Tanssikuvio" value={dance.formation ?? ""} onChange={onChangeFor('formation')} />
      </RowItem>
      <RowItem>
        <Suggestions values={importedData.formations} onSuggest={onChangeFor('formation')} />
      </RowItem>
    </Row>
    <InstructionEditor value={dance.instructions} onChange={onChangeFor('instructions')} importedInstructions={importedData.instructions} />

  </>;
}

function Suggestions({values, onSuggest}) {
  return <FormGroup label="Ehdotukset wikistä">
      {values.length === 0 && 'Ei ehdotuksia'}
      {values.map(value =>
        <React.Fragment key={value}>
          <Tag large interactive intent="success"
            onClick={() => onSuggest(value)}>
            {value}
          </Tag>
          {' '}
        </React.Fragment>
      )}
  </FormGroup>;
}

function Row({children}) {
  return <div style={{display: 'flex'}}>{children}</div>;
}
function RowItem({children}) {
  return <div style={{margin: '0 5px'}}>{children}</div>;
}

function InstructionEditor({value, onChange, importedInstructions}) {
  const [useDiffing, setUseDiffing] = useState(value !== importedInstructions);

  return <>
    <p>Tanssiohje</p>
    {useDiffing
      ? <DiffingInstructionEditor value={value} onChange={onChange}
          importedInstructions={importedInstructions}
          onResolve={(value) => { setUseDiffing(false); onChange(value); }}/>
      : <MarkdownEditor value={value} onChange={onChange} />
    }
  </>;

}

function DiffingInstructionEditor({value, onChange, importedInstructions, onResolve}) {
  const [imported, setImported] = useState(importedInstructions);
  useEffect(() => setImported(importedInstructions), [importedInstructions]);

  return <Row>
    <RowItem>
      <p>Tietokannassa oleva versio</p>
      <MarkdownEditor value={value} onChange={onChange} />
      <Button text="Käytä tätä versiota" onClick={() => onResolve(value)} />
    </RowItem>
    <RowItem>
      <p>Tanssiwikin versio</p>
      <MarkdownEditor value={imported} onChange={setImported} />
      <Button text="Käytä tätä versiota" onClick={() => onResolve(imported)} />
    </RowItem>
  </Row>;
}
