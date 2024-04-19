"use client";

import parse from "html-react-parser";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";

import { TinyEditor } from "../Editor";
import { InputText } from "primereact/inputtext";

interface Section {
  key: string;
  title: string;
  text?: string;
  sections?: Section[];
}

interface SectionProps {
  section: Section;
  id: string;
  sections: Section[];
  setSections: (sections: Section[]) => void;
}

export const SectionComponent = ({ section, id, setSections, sections }: SectionProps) => {
  const [content, setContent] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [subSections, setSubSections] = useState<Section[]>([]);

  const updateSectionChildren = (
    key: string,
    newSection: Section,
    sections: Section[]
  ): Section[] => {
    return sections.map((s) => {
      if (s.key === key) {
        return { ...s, sections: [...(s.sections || []), newSection] };
      } else if (s.sections) {
        return {
          ...s,
          sections: updateSectionChildren(key, newSection, s.sections),
        };
      }
      return s;
    });
  };

  const addSubSection = () => {
    const newSection = {
      key: `${id}.${subSections.length ? subSections.length + 1 : 1}`,
      title: newSectionName,
    };
    setSections(updateSectionChildren(id, newSection, sections));
    setNewSectionName("");
    setAddVisible(false);
  };

  const handleChange = (value: string) => {
    setContent(value);
    const updatedSections = updateSectionText(section.key, value, sections);
    setSections(updatedSections);
  };

  const updateSectionText = (
    key: string,
    newText: string,
    sections: Section[]
  ): Section[] => {
    return sections.map((s) => {
      if (s.key === key) {
        return { ...s, text: newText };
      } else if (s.sections) {
        return { ...s, sections: updateSectionText(key, newText, s.sections) };
      }
      return s;
    });
  };

  useEffect(() => {
    if (section && section.sections) {
      setSubSections(section.sections);
    }
  }, [section]);

  return (
    <div className="field">
      <Accordion multiple activeIndex={[0]}>
        <AccordionTab header={`${section.key} - ${section.title}`}>
          {section.text && parse(section.text)}
          {subSections?.map((sub, i) => (
            <SectionComponent
              key={sub.key}
              section={sub}
              id={sub.key}
              setSections={setSections}
              sections={sections}
            />
          ))}
          <div className="field">
            <Button
              icon="pi pi-pencil"
              size="small"
              rounded
              raised
              text
              aria-label="Edit"
              severity="success"
              onClick={() => {
                setContent(section.text || "");
                setEditVisible(true);
              }}
              label="Editar Texto da Seção"
            />
          </div>
          <div className="field">
            <Button
              icon="pi pi-plus"
              severity="help"
              text
              rounded
              raised
              onClick={() => setAddVisible(true)}
              label="Adicionar Seção"
            />
          </div>
        </AccordionTab>
      </Accordion>
      <Dialog
        header={section.title}
        visible={editVisible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => setEditVisible(false)}
        footer={
          <Button
            className="mt-4"
            label="Salvar"
            icon="pi pi-save"
            rounded
            raised
            onClick={() => {
              handleChange(content);
              setEditVisible(false);
            }}
          />
        }
      >
        <TinyEditor onChange={setContent} value={content} />
      </Dialog>
      <Dialog
        header="Adicionar Seção"
        visible={addVisible}
        onHide={() => setAddVisible(false)}
        style={{ width: "50vh" }}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="sectionName">Nome da Seção</label>
            <InputText
              id="sectionName"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
            />
          </div>
          <div className="field">
            <Button
              label="Adicionar"
              icon="pi pi-plus"
              onClick={addSubSection}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
