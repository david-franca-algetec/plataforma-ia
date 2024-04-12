"use client";
import './styles.scss'

import React, {FormEvent, useState} from "react";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {TinyEditor} from "@/components/Editor";

function Page() {
  const [content, setContent] = useState('');
  const [visible, setVisible] = useState(false);


  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  const nodes = [
    {
      label: 'Diagnóstico e Teorização',
      key: 1,
      children: [
        {
          label: 'Identificação das partes interessadas e parceiros',
          icon: 'pi pi-fw pi-check',
          key: 1.1,
          text: 'São partes interessadas do projeto de extensão da matéria de Programação Orientada a Objeto em Java, ministrada pelo professor Almir Rogério de Macedo, no Centro Universitário Estácio de Brasília. Dos alunos são: \n' +
            '\n' +
            'Breno Esser:  21 anos, estudante de Ciência da Computação \n' +
            '\n' +
            'Davi Marçal Silva Araújo: 19 anos, estudante de Ciência da Computação \n' +
            '\n' +
            'Gustavo Êrades: 20 anos, estudante de Análise e Desenvolvimento de Sistemas \n' +
            '\n' +
            'Samatha Santos Duarte: 20 anos, estudante de Análise e Desenvolvimento de Sistemas. \n' +
            '\n' +
            'O cliente consiste no coordenador do curso de odontologia do Centro Universitário Estácio de Brasília, Rafael Rodrigues. O cliente concordou com o início do projeto e apresentou a ideia de forma breve na semana do dia 26/09/2023 após encontro com os alunos Gustavo Êrades, Gustavo Paulino e Samantha Santos na sala da coordenadora dos cursos de tecnologia na mesma instituição, Josyane Lannes. Foi marcada uma reunião para a semana seguinte para o levantamento efetivo dos requisitos do sistema a ser desenvolvido.'
        },
        {
          label: 'Problemática e/ou problemas identificados',
          icon: 'pi pi-fw pi-check',
          key: 1.2,
          text: 'Foi identificado que o Cliente, Rafael Rodrigues, precisava de um sistema de prontuário odontológico eletrônico que facilitasse o registros de clientes da odontologia, o diagnóstico por parte dos estudantes do curso e diminuísse a quantidade de papel usada nos prontuários e espaço necessário para armazenar esse papel. Assim, o grupo se disponibilizou a realizar, pelo menos, um projeto inicial para esse prontuário odontológico eletrônico a fim de oferecer essa facilitação ao curso de odontologia do Centro Universitário Estácio de Brasília.'
        },
        {
          label: 'Justificativa',
          icon: 'pi pi-fw pi-check',
          key: 1.3,
          text: 'O projeto em questão corrobora com o aprendizado do paradigma de Orientação a Objeto  uma vez que tal paradigma pode ser facilmente aplicado durante o desenvolvimento da aplicação, afinal o projeto de prontuário eletrônico exige habilidades fundamentais para o desenvolvimento da programação orientada a objeto como a abstração. Além disso, tal projeto também corrobora para a prática real de diversos conceitos e áreas no ramo da Tecnologia da Informação e Comunicação. Por exemplo, o pensamento computacional com a modularização do problema buscando sua simplificação, a Engenharia de Software para o devido gerenciamento das etapas de processos durante o desenvolvimento da aplicação e com os usos de técnicas para elicitação de requisitos e modelagem do sistema (com uso da Linguagem Unificada de Modelagem por exemplo). O sistema solicitado pelo cliente também inclui uma série de requisitos que possibilitam ao grupo o uso de mais de uma técnica e tecnologia por vez, como o uso de bancos de dados, interfaces gráficas e serviços de hospedagem além de possibilitar o uso de conhecimentos anteriores do ramo da Ti adquiridos por cada um dos membros do grupo. Também ajuda no aprendizado da linguagem Java, trabalho em grupo, como lidar com prazos, cobranças e clientes. Portanto, a escolha do grupo quanto a problemática se justifica pois possibilita que seus integrantes adquiram conhecimento e experiências reais quanto ao desenvolvimento de sistemas ao mesmo tempo que põem seus conhecimentos em prática.'
        },
        {
          label: 'Objetivos/resultados/efeitos a serem alcançados (em relação ao problema identificado e sob a perspectiva dos públicos envolvidos)',
          icon: 'pi pi-fw pi-check',
          key: 1.4,
          text: 'Dos objetivos esperados com o desenvolvimento do projeto: \n' +
            '\n' +
            'Criação de uma aplicação em linguagem Java que execute com eficiência o papel de prontuário odontológico \n' +
            '\n' +
            'Um sistema de uso simples e intuitivo \n' +
            '\n' +
            'Integração desse sistema com um banco de dados que garanta a disponibilidade, integridade e confiabilidade dos dados \n' +
            '\n' +
            'Pretende-se ainda que o sistema possibilite vários acessos simultâneos e ainda acessos remotos \n' +
            '\n' +
            'Uso de Interface gráfica com finalidade de garantir a usabilidade do sistema  \n' +
            '\n' +
            'Pretende-se ainda que o sistema seja maleável o suficiente para ser melhor desenvolvido posteriormente '
        },
        {
          label: 'Referencial teórico (subsídio teórico para propositura de ações da extensão)',
          icon: 'pi pi-fw pi-check',
          key: 1.5
        },
      ],
    },
    {
      label: 'Planejamento e desenvolvimento do projeto',
      key: 2,
      children: [
        {label: 'Plano de trabalho', icon: 'pi pi-fw pi-check', key: 2.1},
        {
          label: 'Descrição da forma de envolvimento do público participante na formulação do projeto, seu desenvolvimento e avaliação, bem como as estratégias utilizadas pelo grupo para mobilizá-los.',
          icon: 'pi pi-fw pi-check',
          key: 2.2
        },
        {
          label: 'Referencial teórico (subsídio teórico para propositura de ações da extensão)',
          icon: 'pi pi-fw pi-check',
          key: 2.3
        },
        {label: 'Grupo de trabalho', icon: 'pi pi-fw pi-check', key: 2.4},
        {label: 'Metas, critérios ou indicadores de avaliação do projeto', icon: 'pi pi-fw pi-check', key: 2.5},
        {label: 'Recursos previstos', icon: 'pi pi-fw pi-check', key: 2.6},
        {label: 'Detalhamento técnico do projeto', icon: 'pi pi-fw pi-check', key: 2.7},
      ]
    },
    {
      label: 'Encerramento do Projeto',
      key: 3,
      children: [
        {
          label: 'Relatório Coletivo (podendo ser oral e escrita ou apenas escrita)',
          icon: 'pi pi-fw pi-check',
          key: 3.1
        },
        {label: 'Avaliação de reação da parte interessada', icon: 'pi pi-fw pi-check', key: 3.2},
        {label: 'Relato de Experiência Individual', icon: 'pi pi-fw pi-check', key: 3.2}
      ]
    },
    {
      label: 'Ferramentas utilizadas no desenvolvimento',
      key: 4
    },
    {
      label: 'Base Teórica',
      key: 5
    }
  ];

  return (
    <div className="col-12">
      <div className="card">
        <h5>Prontuário Eletrônico Odontológico</h5>
        <Accordion activeIndex={0}>
          {nodes.map((node) => (
            <AccordionTab header={node.label} key={node.key}>
              <Accordion activeIndex={1.1}>
                {node.children?.map((child) => (
                  <AccordionTab header={child.label} key={child.key}>
                    <div className="p-3">
                      <p>{child.text}</p>
                      <div className="flex justify-content-end">
                        <Button icon="pi pi-pencil" size="small" rounded raised text aria-label="Edit" severity="info"
                                onClick={() => {
                                  if (child.text) {
                                    setContent(child.text)
                                    setVisible(true)
                                  }
                                }}/>
                      </div>
                    </div>
                    <Dialog header={child.label} visible={visible} style={{width: '50vw'}}
                            onHide={() => setVisible(false)}>
                      <TinyEditor onChange={setContent} value={content}/>
                    </Dialog>
                  </AccordionTab>
                ))}
              </Accordion>
            </AccordionTab>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default Page;
