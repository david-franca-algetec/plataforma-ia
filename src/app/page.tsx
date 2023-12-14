"use client";

import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Questions } from "@/types/api";

interface Response {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

const models = {
  ChatGPT: "chatgpt",
  Yi: "yi",
  Zypher: "zypher",
};

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryModule = searchParams.get("model");

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
        module: queryModule,
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

  const setModelQueryParam = useCallback(
    (params: URLSearchParams, queryModule: string | null) => {
      if (queryModule && Object.values(models).includes(queryModule)) {
        params.set("model", queryModule);
      } else {
        params.set("model", models.ChatGPT);
      }
    },
    []
  );

  useEffect(() => {
    axios.get<Questions>("/api/question").then((res) => {
      setQuestions(res.data);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    setModelQueryParam(params, queryModule);
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, queryModule, router, searchParams, setModelQueryParam]);

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
