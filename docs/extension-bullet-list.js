(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/extension-bullet-list"] = {}, global.core));
})(this, (function (exports, core) { 'use strict';

  const ListItem = core.Node.create({
      name: 'listItem',
      addOptions() {
          return {
              HTMLAttributes: {},
          };
      },
      content: 'paragraph block*',
      defining: true,
      parseHTML() {
          return [
              {
                  tag: 'li',
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['li', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addKeyboardShortcuts() {
          return {
              Enter: () => this.editor.commands.splitListItem(this.name),
              Tab: () => this.editor.commands.sinkListItem(this.name),
              'Shift-Tab': () => this.editor.commands.liftListItem(this.name),
          };
      },
  });

  const TextStyle = core.Mark.create({
      name: 'textStyle',
      addOptions() {
          return {
              HTMLAttributes: {},
          };
      },
      parseHTML() {
          return [
              {
                  tag: 'span',
                  getAttrs: element => {
                      const hasStyles = element.hasAttribute('style');
                      if (!hasStyles) {
                          return false;
                      }
                      return {};
                  },
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['span', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              removeEmptyTextStyle: () => ({ state, commands }) => {
                  const attributes = core.getMarkAttributes(state, this.type);
                  const hasStyles = Object.entries(attributes).some(([, value]) => !!value);
                  if (hasStyles) {
                      return true;
                  }
                  return commands.unsetMark(this.name);
              },
          };
      },
  });

  const inputRegex = /^\s*([-+*])\s$/;
  const BulletList = core.Node.create({
      name: 'bulletList',
      addOptions() {
          return {
              itemTypeName: 'listItem',
              HTMLAttributes: {},
              keepMarks: false,
              keepAttributes: false,
          };
      },
      group: 'block list',
      content() {
          return `${this.options.itemTypeName}+`;
      },
      parseHTML() {
          return [
              { tag: 'ul' },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['ul', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              toggleBulletList: () => ({ commands, chain }) => {
                  if (this.options.keepAttributes) {
                      return chain().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(ListItem.name, this.editor.getAttributes(TextStyle.name)).run();
                  }
                  return commands.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks);
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
          };
      },
      addInputRules() {
          let inputRule = core.wrappingInputRule({
              find: inputRegex,
              type: this.type,
          });
          if (this.options.keepMarks || this.options.keepAttributes) {
              inputRule = core.wrappingInputRule({
                  find: inputRegex,
                  type: this.type,
                  keepMarks: this.options.keepMarks,
                  keepAttributes: this.options.keepAttributes,
                  getAttributes: () => { return this.editor.getAttributes(TextStyle.name); },
                  editor: this.editor,
              });
          }
          return [
              inputRule,
          ];
      },
  });

  exports.BulletList = BulletList;
  exports["default"] = BulletList;
  exports.inputRegex = inputRegex;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
