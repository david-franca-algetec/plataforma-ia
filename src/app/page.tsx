"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import { Rating } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { Questions } from "@/types/api";

interface Response {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

export default function Home() {
  const toast = useRef<Toast>(null);
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    key: string | number;
  }>({ key: "", name: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Questions>();

  const show = () => {
    toast.current?.show({
      severity: "info",
      summary: "Info",
      detail: "Resposta enviada",
      life: 3000,
    });
  };

  const defaultValues = {
    answer: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const [response, setResponse] = useState<Response>();

  const onSubmit = (data: { answer: string }) => {
    setLoading(true);

    axios
      .post<Response>("/api/grade", {
        answer: data.answer,
        id: selectedCity.key,
      })
      .then((res) => {
        setResponse(res.data);
        show();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      });
  };

  const getFormErrorMessage = (name: keyof { answer: string }) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const options = useMemo(
    () =>
      questions
        ? questions.questions.map((q) => ({ name: q.question, key: q.id }))
        : [],
    [questions]
  );

  useEffect(() => {
    axios.get<Questions>("/api/question").then((res) => {
      setQuestions(res.data);
    });
  }, []);

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="w-full">
        <Dropdown
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.value)}
          options={options}
          optionLabel="name"
          placeholder="Selecione uma pergunta"
          className="w-full mb-2"
        />
      </div>
      {selectedCity?.name && <h5>Pergunta: {selectedCity?.name}</h5>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-column gap-2"
      >
        <Controller
          name="answer"
          control={control}
          rules={{ required: "A resposta é obrigatória" }}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                className="block text-900 font-medium text-xl mb-2"
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
              {getFormErrorMessage(field.name)}
            </>
          )}
        />
        <Button
          label="Enviar"
          type="submit"
          icon="pi pi-check"
          loading={loading}
        />
      </form>
      {response && (
        <div className="flex justify-content-center flex-column text-center">
          <h4>{response.feedback}</h4>
          <p>
            Sua nota é: <b>{response.score}</b> / 10
          </p>
          <div className="flex justify-content-center">
            <Rating value={response.score / 2} readOnly cancel={false} />
          </div>
        </div>
      )}
    </div>
  );
}
