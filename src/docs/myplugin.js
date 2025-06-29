import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

export default class MyCustomPlugin extends Plugin {
    init() {
        const editor = this.editor;

        // Register custom elements in the schema
        editor.model.schema.register('inputField', {
            allowWhere: '$block',
            allowAttributes: ['id', 'type', 'class', 'placeholder'],
            isInline: true
        });

        editor.model.schema.register('selectField', {
            allowWhere: '$block',
            allowAttributes: ['id', 'class'],
            isInline: true,
            allowContentOf: '$block'
        });

        editor.model.schema.register('optionField', {
            allowIn: 'selectField',
            allowAttributes: ['value'],
            isInline: true,
            allowContentOf: '$text'
        });

        // Downcast (model to view)
        editor.conversion.for('downcast').elementToElement({
            model: 'inputField',
            view: (modelItem, { writer }) => writer.createContainerElement('input', {
                type: modelItem.getAttribute('type'),
                id: modelItem.getAttribute('id'),
                class: modelItem.getAttribute('class'),
                placeholder: modelItem.getAttribute('placeholder')
            })
        });

        editor.conversion.for('downcast').elementToElement({
            model: 'selectField',
            view: (modelItem, { writer }) => writer.createContainerElement('select', {
                id: modelItem.getAttribute('id'),
                class: modelItem.getAttribute('class')
            })
        });

        editor.conversion.for('downcast').elementToElement({
            model: 'optionField',
            view: (modelItem, { writer }) => writer.createContainerElement('option', {
                value: modelItem.getAttribute('value')
            }, modelItem.getChildren())
        });

        // Upcast (view to model)
        editor.conversion.for('upcast').elementToElement({
            view: { name: 'input', attributes: ['type', 'id', 'class', 'placeholder'] },
            model: (viewElement, { writer }) => writer.createElement('inputField', {
                type: viewElement.getAttribute('type'),
                id: viewElement.getAttribute('id'),
                class: viewElement.getAttribute('class'),
                placeholder: viewElement.getAttribute('placeholder')
            })
        });

        editor.conversion.for('upcast').elementToElement({
            view: { name: 'select', attributes: ['id', 'class'] },
            model: (viewElement, { writer }) => writer.createElement('selectField', {
                id: viewElement.getAttribute('id'),
                class: viewElement.getAttribute('class')
            })
        });

        editor.conversion.for('upcast').elementToElement({
            view: { name: 'option', attributes: ['value'] },
            model: (viewElement, { writer }) => writer.createElement('optionField', {
                value: viewElement.getAttribute('value')
            }, viewElement.getChild(0))
        });

        // Register custom commands
        editor.commands.add('insertTextField', {
            execute: () => {
                const fieldId = `text-field-${Date.now()}`;
                editor.model.change(writer => {
                    const input = writer.createElement('inputField', {
                        type: 'text',
                        id: fieldId,
                        class: 'form-field',
                        placeholder: 'Enter text here'
                    });
                    editor.model.insertContent(input, editor.model.document.selection);
                });
            }
        });

        editor.commands.add('insertDropdown', {
            execute: () => {
                const fieldId = `dropdown-${Date.now()}`;
                editor.model.change(writer => {
                    const select = writer.createElement('selectField', {
                        id: fieldId,
                        class: 'form-field'
                    });
                    const option1 = writer.createElement('optionField', { value: 'option1' }, 'Option 1');
                    const option2 = writer.createElement('optionField', { value: 'option2' }, 'Option 2');
                    writer.append(option1, select);
                    writer.append(option2, select);
                    editor.model.insertContent(select, editor.model.document.selection);
                });
            }
        });

        // Register toolbar buttons
        editor.ui.componentFactory.add('insertTextField', locale => {
            const button = new ButtonView(locale);
            button.set({
                label: 'Insert Text Field',
                tooltip: true,
                icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h16v2H2zM2 9h16v2H2zM2 13h16v2H2z"/></svg>'
            });
            button.on('execute', () => {
                editor.execute('insertTextField');
            });
            return button;
        });

        editor.ui.componentFactory.add('insertDropdown', locale => {
            const button = new ButtonView(locale);
            button.set({
                label: 'Insert Dropdown',
                tooltip: true,
                icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 7l5 5 5-5H5z"/></svg>'
            });
            button.on('execute', () => {
                editor.execute('insertDropdown');
            });
            return button;
        });
    }
}