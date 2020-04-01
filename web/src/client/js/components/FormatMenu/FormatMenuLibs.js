/**
 * This is where all modifying of CodeMirror should happen
 *
 * Most of these functions are taken and modified from EasyMDE, as they are the useful bits for
 * adding/toggling formatting of the text of CodeMirror
 *
 * We are not using EasyMDE, as the base CodeMirror in Markdown mode is quite enough. EasyMDE
 * caused too many bugs
 *
 * https://github.com/Ionaru/easy-markdown-editor
 * Copyright (c) 2015 Sparksuite, Inc.
 * Copyright (c) 2017 Jeroen Akkerman.
 */

import { commands } from 'codemirror'
import {
  getState,
  replaceSelection,
  shiftTabAndUnindentMarkdownList,
  tabAndIndentMarkdownList,
  toggleBlock,
  toggleHeading,
  toggleLine,
} from 'Libs/codemirror'

const blockStyles = {
  'bold': '**',
  'code': '```',
  'italic': '_',
}

const insertTexts = {
  link: ['[', '](#url#)'],
  horizontalRule: ['---', ''],
}

/**
 * Action for drawing a link.
 */
export function drawLink(editor) {
  const cm = editor
  const stat = getState(cm)
  const url = 'https://'
  replaceSelection(cm, stat.link, insertTexts.link, url)
}

/**
 * Action for drawing a horizontal rule.
 */
export function drawHorizontalRule(editor) {
  const cm = editor
  const stat = getState(cm)
  replaceSelection(cm, stat.image, insertTexts.horizontalRule)
}

export function toggleBold(editor) {
  toggleBlock(editor, 'bold', blockStyles.bold)
}

export function toggleItalic(editor) {
  toggleBlock(editor, 'italic', blockStyles.italic)
}

export function toggleStrikeThrough(editor) {
  toggleBlock(editor, 'strikethrough', '~~')
}

export function toggleHeading1(editor) {
  toggleHeading(editor, 1)
}

export function toggleHeading2(editor) {
  toggleHeading(editor, 2)
}

export function toggleHeading3(editor) {
  toggleHeading(editor, 3)
}

export function toggleHeading4(editor) {
  toggleHeading(editor, 4)
}

export function toggleHeading5(editor) {
  toggleHeading(editor, 5)
}

export function toggleHeading6(editor) {
  toggleHeading(editor, 6)
}

export function toggleUnorderedList(editor) {
  toggleLine(editor, 'unordered-list')
}

export function toggleOrderedList(editor) {
  toggleLine(editor, 'ordered-list')
}

export function toggleBlockquote(editor) {
  toggleLine(editor, 'quote')
}


/**
 * Add commands to CodeMirror for keyboard shortcuts
 * -----------------------------------------------------------------------------
 */

// These are applied in the CodeMirror options object for extraKeys
// This is in FieldTextComponent.js
const bindings = {
  'drawLink': drawLink,
  'shiftTabAndUnindentMarkdownList': shiftTabAndUnindentMarkdownList,
  'tabAndIndentMarkdownList': tabAndIndentMarkdownList,
  'toggleBlockquote': toggleBlockquote,
  'toggleBold': toggleBold,
  'toggleHeading1': toggleHeading1,
  'toggleHeading2': toggleHeading2,
  'toggleHeading3': toggleHeading3,
  'toggleHeading4': toggleHeading4,
  'toggleHeading5': toggleHeading5,
  'toggleHeading6': toggleHeading6,
  'toggleItalic': toggleItalic,
  'toggleOrderedList': toggleOrderedList,
  'toggleUnorderedList': toggleUnorderedList,
}

// Add the commands to CodeMirror
Object.keys(bindings).forEach((binding) => {
  commands[binding] = bindings[binding]
})
