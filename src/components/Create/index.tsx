"use client";

import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import React, {useCallback, useEffect, useState} from "react";

import {SectionComponent} from "@/components/Section";
import rawSections from "./rawSections.json";
import {useHomeworkStore} from "@/providers/homework-provider";

interface Section {
  key: string;
  title: string;
  text?: string;
  sections?: Section[];
}

interface CreateProps {
  id: string | null;
}

export function Create({id}: CreateProps) {
  const {findHomework, addHomework, totalHomeworks} = useHomeworkStore((state) => state)
  const [sections, setSections] = useState<Section[]>(rawSections);
  const [docName, setDocName] = useState<string>("");

  const verifyHomework = useCallback((id: string | null) => {
    if (!id) {
      setDocName("");
      setSections(rawSections);
      return
    }

    const homework = findHomework(id);

    if (homework) {
      setDocName(homework.title);
      setSections(homework.sections || []);
    }
  }, [findHomework]);

  const handleFinish = () => {
    addHomework({
      id: totalHomeworks().toString(),
      title: docName,
      sections: sections
    })

    setDocName("");
    setSections(rawSections);
  };

  useEffect(() => {
    verifyHomework(id);
  }, [id, verifyHomework]);

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
          {sections?.map((section) => (
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
