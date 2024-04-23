"use client";

import React, {useRef, useState} from "react";

import {Create} from "@/components/Create";
import {Evaluate} from "@/components/Evaluate";

import {ListView} from "@/components/ListView";
import {Toast} from "primereact/toast";

function Page() {
  const [id, setId] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <Create id={id} toast={toast}/>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <ListView setId={setId} toast={toast}/>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <Evaluate toast={toast} />
        </div>
      </div>
    </div>
  );
}

export default Page;
