import { Card } from "primereact/card";
import React, { useState } from "react";
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
import { res } from "./res";

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
  markdown +=
    "| Critérios                                   | Feedback                                                                                              | Pontuação |\n";
  markdown +=
    "|---------------------------------------------|-------------------------------------------------------------------------------------------------------|-----------|\n";
  markdown += `| 1. Diagnóstico e teorização                 | ${obj.feedback_diagnostico_e_teorizacao} | ${obj.pontuacao_diagnostico_e_teorizacao}       |\n`;
  markdown += `| 2. Planejamento e desenvolvimento do projeto| ${obj.feedback_planejamento_e_desenvolvimento} | ${obj.pontuacao_planejamento_e_desenvolvimento}       |\n`;
  markdown += `| 3. Relato coletivo                          | ${obj.feedback_relato_coletivo} | ${obj.pontuacao_relato_coletivo}       |\n`;
  markdown += `| 4. Relato de experiência individual         | ${obj.feedback_relato_experiencia_individual} | ${obj.pontuacao_relato_experiencia_individual}       |\n\n`;
  markdown += `### Pontuação Total\n\n**${obj.pontuacao_total} / 10.0**\n\n`;
  markdown += `### Comentários Finais\n\n${obj.comentarios_finais}`;

  return markdown;
}

export function Evaluate() {
  const [response, setResponse] = useState<ApiResponse | null>(res);

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
