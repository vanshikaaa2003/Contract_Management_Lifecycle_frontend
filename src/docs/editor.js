import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import MyCustomPlugin from './myplugin';

document.addEventListener('DOMContentLoaded', () => {
    ClassicEditor
        .create(document.querySelector('#editor'), {
            plugins: [Essentials, Bold, Italic, Heading, List, MyCustomPlugin],
            toolbar: {
                items: [
                    'heading', '|',
                    'bold', 'italic', '|',
                    'bulletedList', 'numberedList', '|',
                    'undo', 'redo', '|',
                    'insertTextField', 'insertDropdown'
                ]
            }
        })
        .then(editor => {
            window.editorInstance = editor;
            console.log('Editor initialized from editor.js');
        })
        .catch(error => {
            console.error('CKEditor initialization error:', error);
        });
});