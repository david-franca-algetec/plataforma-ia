"use client";

import React, {useState} from "react";

import {Create} from "@/components/Create";
import {Evaluate} from "@/components/Evaluate";

import {ListView} from "@/components/ListView";

function Page() {
  const [id, setId] = useState<string | null>(null);
  const [evaluateId, setEvaluateId] = useState<string | null>(null);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Create id={id}/>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <ListView setId={setId} setEvaluateId={setEvaluateId}/>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <Evaluate id={evaluateId} />
        </div>
      </div>
    </div>
  );
}

export default Page;
