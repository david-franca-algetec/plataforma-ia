import {createServer, Model} from "miragejs"
import {ModelDefinition} from "miragejs/-types";
import {Question, QuestionCreate, Questions, QuestionUpdate} from "@/types/api";

const QuestionCreateModel: ModelDefinition<QuestionCreate> = Model.extend({})
const QuestionUpdateModel: ModelDefinition<QuestionUpdate> = Model.extend({})

export function makeServer({environment = "test"} = {}) {
  return createServer({
    environment,

    models: {
      allQuestion: Model.extend<Partial<Questions>>({}),
      question: Model.extend<Partial<Question>>({}),
      questionCreate: QuestionCreateModel,
      questionUpdate: QuestionUpdateModel
    },

    routes() {
      this.namespace = "api"

      this.get("/question/all", (schema) => {
        return {
          questions: [
            {
              id: 1,
              question: "O que é fotossíntese?"
            },
            {
              id: 2,
              question: "Quais são os principais componentes necessários para ocorrer a fotossíntese?"
            }
          ]
        }
      })
      this.get("/question/show/:id")
      this.post("/question/create")
      this.put("/question/update/:id")
      this.post("/grade", (schema, request) => {
        const {answer} = JSON.parse(request.requestBody)
        return {
          question: "O que é fotossíntese?",
          answer,
          score: 10,
          asessment: "Sua resposta está excelente!"
        }
      })
    },
  })
}
