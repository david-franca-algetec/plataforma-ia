'use client';

import React, {RefObject, useCallback, useMemo, useRef, useState} from 'react';
import {Card} from "primereact/card";
import {Dropdown} from "primereact/dropdown";
import {InputTextarea} from "primereact/inputtextarea";
import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
  ItemTemplateOptions
} from "primereact/fileupload";
import {Button} from "primereact/button";
import {ProgressBar} from "primereact/progressbar";
import {Tag} from "primereact/tag";
import MarkdownPreview from '@uiw/react-markdown-preview';
import remarkTypography from '@mavrin/remark-typograf';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkEmoji from 'remark-emoji';
import remarkFlexibleContainers from 'remark-flexible-containers';
import remarkFlexibleMarkers from 'remark-flexible-markers';
import remarkIns from 'remark-ins';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {Toast} from "primereact/toast";

interface DropdownItem {
  label: string;
  value: string;
}

interface ApiResponse {
  data: string
}

const rehypePlugins = [rehypeKatex, rehypeStringify, remarkRehype];

const remarkPlugins = [
  remarkEmoji,
  remarkTypography,
  remarkMath,
  remarkParse,
  remarkFlexibleMarkers,
  remarkIns,
  remarkFlexibleContainers,
];

function Evaluate() {
  const [modelItem, setModelItem] = useState<string | null>('Simple');
  const [typeItem, setTypeItem] = useState<string | null>('archive');
  const [inputValue, setInputValue] = useState<string>('');
  const [filesTotalSize, setFilesTotalSize] = useState(0);
  const uploadRef = useRef<FileUpload>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const modelItems: DropdownItem[] = useMemo(
    () => [
      {label: 'Modelo Completo', value: 'Complete'},
      {label: 'Modelo Simples', value: 'Simple'},
    ],
    []
  );
  const typeItems: DropdownItem[] = useMemo(
    () => [
      {label: 'Arquivo (DOCX, PDF)', value: 'archive'},
      {label: 'Texto', value: 'text'},
    ],
    []
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    setResponse(null);
    const docFile = uploadRef.current?.getFiles()[0];
    const formData = new FormData();

    if (docFile && !inputValue) {
      formData.append('file', docFile);
    }

    if (inputValue && !docFile) {
      const blob = new Blob([inputValue], {type: 'text/plain'});
      const textFile = new File([blob], 'input.txt');

      formData.append('file', textFile);
    }

    formData.append('data', JSON.stringify({
      type: modelItem
    }));

    if (!API_URL || !API_KEY) {
      toast.current?.show({severity: 'error', summary: 'Error', detail: 'API_URL or API_KEY is not defined', life: 3000});
      setIsLoading(false);
      return;
    }

    const url = `${API_URL}/grades`
    
    fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY
      },
      body: formData
    }).then((res) => res.json()).then((res) => {
      console.log(res)
      setResponse(res);
      setIsLoading(false);
    }).catch(error => {
      toast.current?.show({severity: 'error', summary: 'Error', detail: error, life: 3000});
      setIsLoading(false);
    })

    // fetch('/api/evaluate', {
    //   method: 'POST',
    //   body: formData,
    // }).then(res => res.json()).then(res => {
    //   setResponse(res);
    //   setIsLoading(false);
    // }).catch(error => {
    //   toast.current?.show({severity: 'error', summary: 'Error', detail: error, life: 3000});
    //   setIsLoading(false);
    // })
  }, [inputValue, modelItem, API_URL, API_KEY]);

  const onTemplateSelect = (
    e: FileUploadSelectEvent,
  ) => {
    let _totalSize = filesTotalSize;
    const files = e.files;

    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0;
    }

    setFilesTotalSize(_totalSize);
  };

  const onTemplateUpload = (
    e: FileUploadUploadEvent,
  ) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setFilesTotalSize(_totalSize);
  };

  const onTemplateRemove = (
    file: File,
    callback: any,
  ) => {
    setFilesTotalSize(filesTotalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setFilesTotalSize(0);
  };

  const headerTemplate = (
    options: FileUploadHeaderTemplateOptions,
    refUpload: RefObject<FileUpload>,
    maxSize: number,
    maxText: string,
    totalSize: number
  ) => {
    const {className, chooseButton, cancelButton} = options;
    const value = totalSize / maxSize;
    const formattedValue =
      refUpload && refUpload.current
        ? refUpload.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="grid">
          <div className="col-12 md:col-6">

            {chooseButton}
          </div>
          <div className="col-12 md:col-6">
            {cancelButton}
          </div>
        </div>
        <div className="flex align-items-center gap-3 ml-auto">
          <span>
            {formattedValue} / {maxText}
          </span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{width: "10rem", height: "12px"}}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (
    inFile: object,
    props: ItemTemplateOptions,
  ) => {
    const file = inFile as File;
    return (
      <div className="flex align-items-center flex-wrap">
        <Toast ref={toast} />
        <div
          className="flex align-items-center"
          style={{width: "calc(40% + 100px)"}}
        >
          {/* <img alt={file.name} role="presentation" src={file.objectURL} width={100} /> */}
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto w-3rem h-3rem"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{fontSize: "1.2em", color: "var(--text-color-secondary)"}}
          className="my-3"
        >
          Arraste e solte o arquivo aqui
        </span>
      </div>
    );
  };

  function jsonToMarkdown(jsonString: string) {
    // Analisar a string JSON para um objeto
    const obj = JSON.parse(jsonString) as {
      feedback_diagnostico_e_teorizacao: string;
      feedback_planejamento_e_desenvolvimento: string;
      feedback_relato_coletivo: string;
      feedback_relato_experiencia_individual: string;
      pontuacao_diagnostico_e_teorizacao: number;
      pontuacao_planejamento_e_desenvolvimento: number;
      pontuacao_relato_coletivo: number;
      pontuacao_relato_experiencia_individual: number;
      pontuacao_total: number;
      comentarios_finais: string;
    };

    // Iniciar a string Markdown
    let markdown = "### Tabela Rubrica\n\n";
    markdown += "| Critérios                                   | Feedback                                                                                              | Pontuação |\n";
    markdown += "|---------------------------------------------|-------------------------------------------------------------------------------------------------------|-----------|\n";
    markdown += `| 1. Diagnóstico e teorização                 | ${obj.feedback_diagnostico_e_teorizacao} | ${obj.pontuacao_diagnostico_e_teorizacao}       |\n`;
    markdown += `| 2. Planejamento e desenvolvimento do projeto| ${obj.feedback_planejamento_e_desenvolvimento} | ${obj.pontuacao_planejamento_e_desenvolvimento}       |\n`;
    markdown += `| 3. Relato coletivo                          | ${obj.feedback_relato_coletivo} | ${obj.pontuacao_relato_coletivo}       |\n`;
    markdown += `| 4. Relato de experiência individual         | ${obj.feedback_relato_experiencia_individual} | ${obj.pontuacao_relato_experiencia_individual}       |\n\n`;
    markdown += `### Pontuação Total\n\n**${obj.pontuacao_total} / 10.0**\n\n`;
    markdown += `### Comentários Finais\n\n${obj.comentarios_finais}`;

    return markdown;
  }

  return (
    <div>
      <Card className="mb-2" title="Avaliar Trabalho">
        <form noValidate onSubmit={onSubmit} className="p-fluid formgrid grid">
          <div className="field col-12 md:col-6">
            <label htmlFor="model">Selecione um Modelo</label>
            <Dropdown id="model" value={modelItem} onChange={(e) => setModelItem(e.value)} options={modelItems}
                      placeholder="Selecione um modelo" className="w-full"/>
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="type">Tipo de Entrada</label>
            <Dropdown id="type" value={typeItem} onChange={(e) => setTypeItem(e.value)} options={typeItems}
                      placeholder="Selecione uma entrada" className="w-full"/>
          </div>
        </form>
        <div className="p-fluid formgrid grid">
          {typeItem === 'text' && (
            <div className="field col-12">
              <label htmlFor="type">Conteúdo do Trabalho</label>
              <InputTextarea rows={20} cols={30} className="w-full" value={inputValue}
                             onChange={(e) => setInputValue(e.target.value)}/>
            </div>
          )}
          {typeItem === 'archive' && (
            <div className="field col-12">
              <label htmlFor="arquive[]">Arquivo do Trabalho</label>
              <FileUpload
                ref={uploadRef}
                name="arquive[]"

                accept={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].join(', ')}
                maxFileSize={1000000} // 300 MB (300 * 1024 * 1024) = 314572800 bytes
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={(e) =>
                  headerTemplate(e, uploadRef, 1000000, "10 MB", filesTotalSize)
                }
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseLabel="Escolher"
                cancelLabel="Cancelar"
                uploadOptions={{
                  className: "hidden",
                }}
                customUpload
              />
            </div>
          )}
          <div className="field col-12">
            <Button label="Enviar"
                    icon="pi pi-check"
                    onClick={onSubmit} loading={isLoading}/>
          </div>
        </div>
      </Card>
      {response && (
        <Card className="mb-2">
          <MarkdownPreview
            source={jsonToMarkdown(response.data)}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            wrapperElement={{
              'data-color-mode': 'light',
            }}
          />

        </Card>
      )}
    </div>
  );
}

export default Evaluate;