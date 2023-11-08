'use client';

import {Controller, useForm} from 'react-hook-form';
import {Button} from 'primereact/button';
import {classNames} from 'primereact/utils';
import {Toast} from 'primereact/toast';
import {useRef, useState} from "react";
import {InputTextarea} from "primereact/inputtextarea";
import {Card} from "primereact/card";
import axios from "axios";
import {Rating} from "primereact/rating";

interface Response {
  question: string,
  answer: string,
  score: number,
  asessment: string,
}

export default function Home() {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const show = () => {
    toast.current?.show({severity: 'info', summary: 'Info', detail: 'Resposta enviada', life: 3000});
  };

  const defaultValues = {
    answer: ''
  };

  const {
    control,
    formState: {errors},
    handleSubmit,
    getValues,
    reset
  } = useForm({defaultValues});

  const [response, setResponse] = useState<Response>();

  const onSubmit = (data: { answer: string }) => {
    setLoading(true);
    axios.post<Response>('/api/send', {
      answer: data.answer
    }).then((res) => {
      setResponse(res.data)
      show()
      reset();
      setLoading(false);
    })
      .catch((error) => {
        setLoading(false);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        })
      })
  };

  const getFormErrorMessage = (name: keyof { answer: string }) => {
    return errors[name] ? <small className="p-error">{errors[name]?.message}</small> :
      <small className="p-error">&nbsp;</small>;
  };

  return (
    <div className="flex justify-content-center">
      <Card title="O que é fotossíntese?" className="w-full md:w-30rem">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2">
          <Toast ref={toast}/>
          <Controller
            name="answer"
            control={control}
            rules={{required: 'A resposta é obrigatória'}}
            render={({field, fieldState}) => (
              <>
                <label htmlFor={field.name}>Resposta</label>
                <InputTextarea id={field.name} {...field} rows={4} cols={30}
                               className={classNames({'p-invalid': fieldState.error})}/>
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
          <Button label="Enviar" type="submit" icon="pi pi-check" loading={loading}/>
        </form>
        {response && (
          <div className="card p-3 w-full md:w-30rem flex justify-content-center flex-column text-center">
            <h4>{response.asessment}</h4>
            <p>
              Sua nota é: <b>{response.score}</b> / 10
            </p>
            <div className="flex justify-content-center">

              <Rating value={response.score / 2} readOnly cancel={false}/>
            </div>
          </div>
        )}
      </Card>

    </div>
  )
}