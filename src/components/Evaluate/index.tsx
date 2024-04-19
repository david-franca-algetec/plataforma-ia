import {Card} from "primereact/card";
import React, {useCallback, useEffect, useRef, useState} from "react";
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
  id: string | null;
}

export function Evaluate({id}: EvaluateProps) {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {findHomework} = useHomeworkStore((state) => state)

  const toast = useRef<Toast>(null);

  let textContent = '';

  function writeSections(sections?: Section[], indent = '') {
    sections?.forEach((section) => {
      textContent += `${indent}${section.key} - ${section.title}\n${indent}${section.text || ''}\n\n`;
      if (section.sections) {
        writeSections(section.sections, `${indent}  `);
      }
    });
  }

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    setResponse(null);

    const homework = findHomework(id);

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

    textContent = `Homework ID: ${homework.id}\\nTitle: ${homework.title}\\n\\n`;

    writeSections(homework.sections)

    const textFile = new Blob([textContent], {type: 'text/plain'});

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
    }).catch(error => {
      toast.current?.show({severity: 'error', summary: 'Error', detail: error, life: 3000});
      setIsLoading(false);
    })
  }, [id, findHomework]);

  useEffect(() => {
    if (id) {
      onSubmit().then(() => {

          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Trabalho avaliado com sucesso!',
            life: 3000
          });

      });
    }
  }, [id, onSubmit]);

  if (isLoading) {
    return <Card className="mb-2 text-center">
      <ProgressSpinner />
    </Card>;
  }

  return (
    response && (
      <Card className="mb-2">
        <MarkdownPreview
          source={jsonToMarkdown(response.data)}
          rehypePlugins={rehypePlugins}
          remarkPlugins={remarkPlugins}
          wrapperElement={{
            "data-color-mode": "light",
          }}
        />
      </Card>
    )
  );
}
