"use client";

import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import React, {RefObject, useCallback, useEffect, useMemo, useState} from "react";

import {SectionComponent} from "@/components/Section";
import rawSections from "./rawSections.json";
import {useHomeworkStore} from "@/providers/homework-provider";
import {Toast} from "primereact/toast";

interface Section {
  key: string;
  title: string;
  text?: string;
  sections?: Section[];
}

interface CreateProps {
  id: string | null;
  toast: RefObject<Toast>
}

export function Create({id, toast}: CreateProps) {
  const {findHomework, addHomework, totalHomeworks, editHomework} = useHomeworkStore((state) => state)
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
    if (!docName) return;
    if (id) {
      editHomework({
        id,
        title: docName,
        sections: sections
      })
      return
    }
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
      <Toast />
      <div className="col-12">
        <div className="card p-fluid">
          <h5>Adicionar Trabalho</h5>
          <div className="field">
            <label htmlFor="name">Título</label>
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
              label="Salvar Rascunho"
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
