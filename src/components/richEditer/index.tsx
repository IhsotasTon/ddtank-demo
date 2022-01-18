import { useQuill } from 'react-quilljs';
// or const { useQuill } = require('react-quilljs');

import 'quill/dist/quill.snow.css'; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

export default function RichEditer(){
  const { quill, quillRef } = useQuill();
  return (
    <div style={{ width: 500, height: 300,display:'none' }}>
      <div ref={quillRef} />
    </div>
  );
};