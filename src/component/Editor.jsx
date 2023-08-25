import React, { useEffect, useRef } from 'react';
import { fromTextArea } from 'codemirror';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import ACTIONS from '../pages/Actions';

export default function Editor({ onCodeChange, socketRef, roomId }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = fromTextArea(editorRef.current, {
      mode: 'javascript',
      theme: 'dracula',
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });
    editor.setSize('', window.innerHeight + '');

    editor.on('change', (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange(code);
      if (origin !== 'setValue') {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
          if (code !== null) {
            editor.setValue(code);
          }
      });
  }
    // Return a cleanup function to handle unmounting
    return () => {
      editor.toTextArea(); // Destroy the CodeMirror instance when unmounting
    };
  }, [onCodeChange, roomId, socketRef]);

  useEffect(() => {
    

    return () => {
        socketRef?.current?.off(ACTIONS.CODE_CHANGE);
    };
}, [socketRef.current]);

  return <textarea ref={editorRef}></textarea>;
}
