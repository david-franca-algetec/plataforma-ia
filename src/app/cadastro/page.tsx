"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
import translation from "zod-i18n-map/locales/pt/zod.json";
import i18next from "i18next";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Questions } from "@/types/api";

i18next
  .init({
    lng: "es",
    resources: {
      es: { zod: translation },
    },
  })
  .then();

z.setErrorMap(zodI18nMap);

const schema = z.object({
  question: z.string().min(1),
  answers: z
    .array(
      z.object({
        text: z.string().min(1),
        score: z.number().min(0).max(10),
        feedback: z.string().min(1),
      })
    )
    .min(1),
});

type FormValues = z.infer<typeof schema>;

function Cadastro() {
  const toast = useRef<Toast>(null);

  const defaultValues = {
    title: "",
    answers: [{ text: "", score: 0, feedback: "" }],
  };

  const [selectedAnswer, setSelectedAnswer] = useState<{
    name: string;
    key: string | number;
  }>({ key: "", name: "" });
  const [questions, setQuestions] = useState<Questions>();

  const options = useMemo(
    () =>
      questions
        ? questions.questions.map((q) => ({ name: q.question, key: q.id }))
        : [],
    [questions]
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({ defaultValues, resolver: zodResolver(schema) });

  const { fields, append, remove, update } = useFieldArray({
    name: "answers",
    control,
    rules: {
      required: "Please append at least 1 item",
    },
  });

  const getFormErrorMessage = (name: keyof FormValues) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const onSubmit = (data: FormValues) => {
    if (!selectedAnswer.key) {
      fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (response) => {
          if (response.ok) {
            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: "Respostas enviadas",
              life: 3000,
            });
            return;
          }
          const json = await response.json();
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: json.message,
            life: 3000,
          });
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
          });
        });
    } else {
      fetch(`/api/question/${selectedAnswer.key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (response) => {
          if (response.ok) {
            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: "Respostas enviadas",
              life: 3000,
            });
            return;
          }
          const json = await response.json();
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: json.message,
            life: 3000,
          });
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
          });
        });
    }
  };

  useEffect(() => {
    fetch("/api/question")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  useEffect(() => {
    console.log(selectedAnswer);

    if (selectedAnswer.key) {
      fetch(`/api/question/${selectedAnswer.key}`)
        .then(
          (res) => res.json() as Promise<{ answers: any[]; question: string }>
        )
        .then((data) => {
          const answers = data.answers.map((a) => ({
            text: a.text,
            score: a.score,
            feedback: a.feedback,
          }));

          reset({ question: data.question, answers });
        });
    }
  }, [append, reset, selectedAnswer]);

  return (
    <div>
      <Toast ref={toast} />
      <Card className="mb-2" title="Cadastro de Pergunta" />
      <div className="w-full">
        <Dropdown
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.value)}
          options={options}
          optionLabel="name"
          placeholder="Nova Pergunta"
          className="w-full mb-2"
        />
      </div>
      <form
        noValidate
        className="flex flex-column gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card>
          <Controller
            name="question"
            control={control}
            rules={{ required: "A resposta é obrigatória" }}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Enunciado
                </label>
                <InputTextarea
                  id={field.name}
                  {...field}
                  rows={4}
                  cols={30}
                  className={`w-full ${classNames({
                    "p-invalid": fieldState.error,
                  })}`}
                />
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
        </Card>
        {fields.map((field, index) => {
          return (
            <Card key={field.id} className="flex flex-column gap-2">
              <Controller
                name={`answers.${index}.score`}
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      className="block text-900 font-medium text-xl mb-2"
                      htmlFor={field.name}
                    >
                      Nota {field.value}
                    </label>
                    <div className="flex gap-2 align-items-center">
                      <Slider
                        id={field.name}
                        value={field.value}
                        min={0}
                        max={10}
                        step={2.5}
                        onChange={(e: SliderChangeEvent) =>
                          field.onChange(e.value)
                        }
                        className={`w-11 ${classNames({
                          "p-invalid": fieldState.error,
                        })}`}
                      />
                      <Button
                        icon="pi pi-times"
                        disabled={fields.length === 1}
                        rounded
                        severity="danger"
                        onClick={() => remove(index)}
                      />
                    </div>
                    <span>
                      {errors.answers?.[index]?.score ? (
                        <small className="p-error">
                          {errors.answers?.[index]?.score?.message}
                        </small>
                      ) : (
                        <small className="p-error">&nbsp;</small>
                      )}
                    </span>
                  </>
                )}
              />
              <Controller
                name={`answers.${index}.text`}
                control={control}
                rules={{ required: "A resposta é obrigatória" }}
                render={({ field, fieldState }) => (
                  <section className="flex flex-column">
                    <label
                      className="block text-900 font-medium text-xl mb-2"
                      htmlFor={field.name}
                    >
                      Resposta
                    </label>
                    <InputTextarea
                      id={field.name}
                      {...field}
                      rows={4}
                      cols={30}
                      className={classNames({ "p-invalid": fieldState.error })}
                    />
                    <span>
                      {errors.answers?.[index]?.text ? (
                        <small className="p-error">
                          {errors.answers?.[index]?.text?.message}
                        </small>
                      ) : (
                        <small className="p-error">&nbsp;</small>
                      )}
                    </span>
                  </section>
                )}
              />
              <Controller
                name={`answers.${index}.feedback`}
                control={control}
                rules={{ required: "A resposta é obrigatória" }}
                render={({ field, fieldState }) => (
                  <section className="flex flex-column">
                    <label
                      className="block text-900 font-medium text-xl mb-2"
                      htmlFor={field.name}
                    >
                      Feedback
                    </label>
                    <InputTextarea
                      id={field.name}
                      {...field}
                      rows={4}
                      cols={30}
                      className={classNames({ "p-invalid": fieldState.error })}
                    />
                    <span>
                      {errors.answers?.[index]?.feedback ? (
                        <small className="p-error">
                          {errors.answers?.[index]?.feedback?.message}
                        </small>
                      ) : (
                        <small className="p-error">&nbsp;</small>
                      )}
                    </span>
                  </section>
                )}
              />
            </Card>
          );
        })}

        <Button
          severity="info"
          label="Adicionar Resposta"
          raised
          text
          onClick={() => {
            append({
              text: "",
              score: 0,
              feedback: "",
            });
          }}
        />
        <Button label="Enviar" type="submit" icon="pi pi-check" />
      </form>
    </div>
  );
}

export default Cadastro;
