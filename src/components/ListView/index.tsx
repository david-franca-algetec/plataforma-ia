import React, {RefObject} from 'react';
import {DataView} from "primereact/dataview";
import {Button} from "primereact/button";
import {useHomeworkStore} from "@/providers/homework-provider";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import {Homework} from "@/stores/homework-store";

interface ListViewProps {
  setId: (id: string | null) => void;
  toast: RefObject<Toast>;
}

export function ListView({setId, toast}: ListViewProps) {
  const {homeworks, removeHomework, setEvaluateId, evaluateId} = useHomeworkStore((state) => state)

  const reject = () => {
    toast.current?.show({severity: 'info', summary: 'Ação cancelada pelo usuário', life: 3000});
  }

  const confirmEdit = (id: string) => {
    confirmDialog({
      message: 'As alterações não salvas serão perdidas.',
      header: 'Deseja continuar?',
      icon: 'pi pi-exclamation-triangle',
      focusOnShow: true,
      accept: () => setId(id),
      reject
    });
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: 'O trabalho será excluído permanentemente.',
      header: 'Deseja continuar?',
      icon: 'pi pi-exclamation-triangle',
      focusOnShow: true,
      accept: () => removeHomework(id),
      reject
    });
  };

  const confirmEvaluate = (id: string) => {
    confirmDialog({
      message: 'O resultado será exibido nessa página após o processamento.\n Você possuirá 1 (uma) hora para cancelar o envio deste trabalho. Deseja continuar?',
      header: 'O trabalho será enviado para avaliação.',
      icon: 'pi pi-exclamation-triangle',
      focusOnShow: true,
      accept: () => setEvaluateId(id),
      reject
    });
  };

  const cancelEvaluate = () => {
    confirmDialog({
      message: 'Deseja continuar?',
      header: 'Cancelar o envio do trabalho?',
      icon: 'pi pi-exclamation-triangle',
      focusOnShow: true,
      accept: () => setEvaluateId(null),
      reject
    });
  };

  const handleEvaluate = (id: string) => {
    if (evaluateId === id) {
      cancelEvaluate()
    }
    if (evaluateId === null) {
      confirmEvaluate(id)
    }
  }

  const dataViewListItem = (data: Homework) => {
    return (
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
          <Button
            icon="pi pi-send"
            label={evaluateId === data.id ? 'Cancelar Envio' : "Enviar Trabalho"}
            severity="success"
            disabled={evaluateId !== null && evaluateId !== data.id}
            size="small"
            className="mb-2"
            style={{
              visibility: evaluateId === null ? 'visible' : evaluateId !== data.id ? 'hidden' : 'visible'
            }}
            onClick={() => handleEvaluate(data.id)}
          />
          <div className="flex-1 flex flex-column align-items-center text-center px-4">
            <div className="font-bold text-2xl">{data.title}</div>
          </div>
          <div
            className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
            <Button
              icon="pi pi-pencil"
              label="Editar"
              severity="info"
              size="small"
              className="mb-2"
              onClick={() => confirmEdit(data.id)}
            />
            <Button
              icon="pi pi-trash"
              label="Apagar"
              severity="danger"
              size="small"
              className="mb-2"
              disabled={data.id === '1'}
              onClick={() => confirmDelete(data.id)}
            />
          </div>
        </div>
      </div>
    );
  };

  const dataViewGridItem = () => {
    return (
      <div className="col-12 lg:col-4">
        {/*<div className="card m-3 border-1 surface-border">*/}
        {/*  <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">*/}
        {/*    <div className="flex align-items-center">*/}
        {/*      <i className="pi pi-tag mr-2" />*/}
        {/*      <span className="font-semibold">{data.category}</span>*/}
        {/*    </div>*/}
        {/*    <span*/}
        {/*      className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}*/}
        {/*    >*/}
        {/*      {data.inventoryStatus}*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*  <div className="flex flex-column align-items-center text-center mb-3">*/}
        {/*    <img*/}
        {/*      src={`/demo/images/product/${data.image}`}*/}
        {/*      alt={data.title}*/}
        {/*      className="w-9 shadow-2 my-3 mx-0"*/}
        {/*    />*/}
        {/*    <div className="text-2xl font-bold">{data.title}</div>*/}
        {/*    <div className="mb-3">{data.description}</div>*/}
        {/*    <Rating value={data.rating} readOnly cancel={false} />*/}
        {/*  </div>*/}
        {/*  <div className="flex align-items-center justify-content-between">*/}
        {/*    <span className="text-2xl font-semibold">${data.price}</span>*/}
        {/*    <Button*/}
        {/*      icon="pi pi-shopping-cart"*/}
        {/*      disabled={data.inventoryStatus === "OUTOFSTOCK"}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    );
  };

  const itemTemplate = (
    data: Homework,
    layout: "grid" | "list" | (string & Record<string, unknown>)
  ) => {
    if (!data) {
      return;
    }

    if (layout === "list") {
      return dataViewListItem(data);
    } else if (layout === "grid") {
      return dataViewGridItem();
    }
  };

  return (
    <>
      <ConfirmDialog/>
      <h5>Rascunhos Salvos</h5>
      <DataView
        value={homeworks}
        layout="list"
        paginator
        rows={5}
        itemTemplate={itemTemplate}
      />
    </>
  );
}