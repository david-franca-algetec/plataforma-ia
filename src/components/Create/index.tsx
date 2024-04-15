"use client";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

import { SectionComponent } from "@/components/Section";

import nodes from "./nodes.json";

interface Section {
  key: string;
  title: string;
  text?: string;
  sections?: Section[];
}

export function Create() {
  const [sections, setSections] = useState<Section[]>(nodes);
  const [docName, setDocName] = useState<string>("");

  const handleFinish = () => {
    const doc = {
      name: docName,
      sections,
    };
    console.log(doc);
  };

  // const addSection = () => {
  //   setSections((prev) => [...prev, { title: "Nova Seção", sections: [] }]);
  // };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card p-fluid">
          <h5>Adicionar Trabalho</h5>
          <div className="field">
            <label htmlFor="name">Nome</label>
            <InputText
              id="name"
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>
          {sections.map((section, index) => (
            <SectionComponent
              section={section}
              key={section.key}
              id={section.key}
              setSections={setSections}
              sections={sections}
            />
          ))}

          <div className="field">
            <Button
              label="Salvar"
              icon="pi pi-save"
              className="p-button-raised p-button-rounded"
              onClick={handleFinish}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
