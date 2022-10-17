import React, {useRef, useState, ComponentProps} from 'react';
import {Icon} from "../ui";
import {Classes} from "@blueprintjs/core";
import classNames from 'classnames';
import {AdditionalPropsFrom, FieldComponentProps} from './types';
import {Input} from './fieldComponents';
import {MarkdownEditor} from './MarkdownEditor';

export interface ClickToEditProps extends FieldComponentProps<string, HTMLInputElement>, AdditionalPropsFrom<ComponentProps<"input">> {
  valueFormatter?: (value: string) => React.ReactNode
  inline?: boolean
}
export function ClickToEdit({value, readOnly, valueFormatter, className, onChange, inline, hasConflict, ...props} : ClickToEditProps) {
  return <ClosableEditor
    className={className}
    inline={inline}
    readOnly={readOnly}
    aria-describedby={props['aria-describedby']} 
    aria-label={props['aria-label']} 
    closedValue={valueFormatter ? valueFormatter(value ?? "") : value}
  >
    <Input {...props} value={value} onChange={onChange} inline={inline} hasConflict={hasConflict} />
  </ClosableEditor>
}

export interface ClickToEditMarkdownProps extends FieldComponentProps<string, HTMLTextAreaElement>, AdditionalPropsFrom<ComponentProps<typeof MarkdownEditor>> {
  className?: string
  valueFormatter?: (value: string) => React.ReactNode
  inline?: boolean
  markdownOverrides?: {}
}
export function ClickToEditMarkdown({value, readOnly, valueFormatter, className, onChange, inline, hasConflict, ...props} : ClickToEditMarkdownProps) {
  return <ClosableEditor
    className={className}
    inline={inline}
    readOnly={readOnly}
    aria-describedby={props['aria-describedby']} 
    aria-label={props['aria-label']} 
    closedValue={valueFormatter ? valueFormatter(value ?? "") : value}
  >
    <MarkdownEditor {...props} value={value} onChange={onChange} />
  </ClosableEditor>
}

interface ClosableEditorProps {
  closedValue: React.ReactNode
  showIcon?: boolean
  readOnly?: boolean
  inline?: boolean
  className?: string
  children: React.ReactNode
  "aria-describedby"?: string
  "aria-label"?: string
}

function ClosableEditor({closedValue, readOnly, inline, children, className, showIcon = true, ...props} : ClosableEditorProps) {
  const [open, setOpen] = useState(false)

  const container = useRef<HTMLElement>(null)
  function openEditor() { 
    if (readOnly) return
    setOpen(true);
    setTimeout(() => (container.current?.querySelector('input, textarea') as HTMLElement)?.focus?.(), 10) 
  }
  function maybeCloseEditor(e: React.FocusEvent<HTMLElement>) {
    const isInsideContainer = e.target !== container.current
    if (isInsideContainer) setOpen(false);
  }
  const Container = inline ? 'span' : 'div'
  const canOpen = !open && !readOnly

  return <Container
    ref={container as any}
    tabIndex={canOpen ? 0 : undefined}
    onClick={openEditor}
    onFocus={openEditor}
    onBlur={maybeCloseEditor}
    className={classNames(className, canOpen && Classes.EDITABLE_TEXT)}
    aria-describedby={canOpen ? undefined : props['aria-describedby']} 
    aria-label={canOpen ? undefined : props['aria-label']} 
  >
    {open || closedValue}
    {canOpen && showIcon && <Icon intent="primary" icon="edit" />}
    {open && children}
  </Container>
}