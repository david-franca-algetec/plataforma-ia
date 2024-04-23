'use client';

import React, {Fragment, RefObject, useCallback, useEffect, useRef, useState} from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import remarkTypography from "@mavrin/remark-typograf";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkEmoji from "remark-emoji";
import remarkFlexibleContainers from "remark-flexible-containers";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkIns from "remark-ins";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {jsonToMarkdown} from "@/utils/jsonToMarkDown";
import {Toast} from "primereact/toast";
import {useHomeworkStore} from "@/providers/homework-provider";
import {Section} from "@/stores/homework-store";
import {ProgressSpinner} from "primereact/progressspinner";

interface ApiResponse {
  data: string;
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

interface EvaluateProps {
  toast: RefObject<Toast>;
}

export function Evaluate({toast}: EvaluateProps) {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {findHomework, evaluateId} = useHomeworkStore((state) => state)

  let textContent = useRef<string>('');

  const writeSections = useCallback((sections?: Section[], indent = '') => {
    sections?.forEach((section) => {
      textContent.current += `${indent}${section.key} - ${section.title}\n${indent}${section.text || ''}\n\n`;
      if (section.sections) {
        writeSections(section.sections, `${indent}  `);
      }
    });
  }, [])

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    setResponse(null);

    const homework = findHomework(evaluateId);

    if (!homework) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Trabalho nao encontrado!',
        life: 3000
      });
      setIsLoading(false);
      return;
    }

    textContent.current = `Homework ID: ${homework.id}\\nTitle: ${homework.title}\\n\\n`;

    writeSections(homework.sections)

    const textFile = new Blob([textContent.current], {type: 'text/plain'});

    const formData = new FormData();

    formData.append('file', textFile);
    formData.append('data', JSON.stringify({
      type: 'Complete'
    }));

    const response = await fetch('/api/evaluate')

    if (!response.ok) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong',
        life: 3000
      });
      setIsLoading(false);
      return;
    }

    const {url, key} = await response.json();

    fetch(`${url}/grades`, {
      method: 'POST',
      headers: {
        'x-api-key': key
      },
      body: formData
    }).then((res) => res.json()).then((res) => {
      setResponse(res);
      setIsLoading(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Trabalho avaliado com sucesso!',
        life: 3000
      });
    }).catch(error => {
      toast.current?.show({severity: 'error', summary: 'Error', detail: error, life: 3000});
      setIsLoading(false);
    })
  }, [findHomework, evaluateId, writeSections, toast]);

  useEffect(() => {
    if (evaluateId) {
      // onSubmit().then()
    }
  }, [evaluateId, onSubmit]);

  // if (isLoading) {
  //   return <div className="mb-2 text-center">
  //     <ProgressSpinner />
  //   </div>;
  // }

  // return (
  //   response && (
  //     <div>
  //       <MarkdownPreview
  //         source={jsonToMarkdown(response.data)}
  //         rehypePlugins={rehypePlugins}
  //         remarkPlugins={remarkPlugins}
  //         wrapperElement={{
  //           "data-color-mode": "light",
  //         }}
  //       />
  //     </div>
  //   )
  // );

  return evaluateId ? (
    <div className="mb-2 text-center">
      <h4>Trabalho em análise...</h4>
    </div>
  ) : <Fragment/>
}
