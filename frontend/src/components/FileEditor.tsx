import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileContent } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import './FileEditor.css';

interface FileEditorProps {
  fileContent: FileContent | null;
  onContentChange: (content: string) => void;
  isLoading: boolean;
}

const FileEditor: React.FC<FileEditorProps> = ({ fileContent, onContentChange, isLoading }) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const currentFilePathRef = useRef<string | null>(null);

  // Simple file tracking for reference
  useEffect(() => {
    if (fileContent) {
      currentFilePathRef.current = fileContent.path;
    }
  }, [fileContent?.path]);

  // Get file language based on extension
  const getLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'md': 'markdown',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'txt': 'plaintext',
      'log': 'plaintext',
      'cfg': 'plaintext',
      'ini': 'ini',
      'sh': 'shell',
      'bash': 'shell',
      'sql': 'sql',
      'php': 'php',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'h': 'c',
      'hpp': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'vue': 'html',
      'dockerfile': 'dockerfile'
    };
    
    return languageMap[extension || ''] || 'plaintext';
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    // Monaco is created with correct defaultLanguage and defaultValue
    // No need for manual setup
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onContentChange(value);
    }
  };

  if (isLoading) {
    return (
      <div className="file-editor loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!fileContent) {
    return (
      <div className="file-editor empty">
        <div className="empty-state">
          <h3>No file selected</h3>
          <p>Select a file from the tree to view and edit its contents.</p>
        </div>
      </div>
    );
  }

  if (fileContent.is_binary) {
    return (
      <div className="file-editor binary">
        <div className="binary-file-message">
          <h3>Binary File</h3>
          <p>This file cannot be displayed as text.</p>
          <p><strong>File:</strong> {fileContent.path}</p>
        </div>
      </div>
    );
  }

  const fileName = fileContent.path.split('/').pop() || '';
  const language = getLanguage(fileName);
  const editorTheme = theme === 'light' ? 'light' : 'vs-dark';

  // Monaco Editor creation

  return (
    <div className="file-editor">
      <div className="file-editor-header">
        <span className="file-name">{fileName}</span>
        <span className="file-path">{fileContent.path}</span>
      </div>
      
      <div className="editor-container">
        <Editor
          key={`monaco-${fileContent.path}`}
          height="100%"
          defaultLanguage={language}
          defaultValue={fileContent.content || ''}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          theme={editorTheme}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            trimAutoWhitespace: true,
            renderLineHighlight: 'line',
            selectionHighlight: true,
            occurrencesHighlight: 'singleFile',
            codeLens: false,
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'mouseover',
            matchBrackets: 'always',
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true
          }}
        />
      </div>
    </div>
  );
};

export default FileEditor;