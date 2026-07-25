import type { WebContainerChallenge } from "../../types";
import appCodeEn from "./App.en.vue?raw";
import appCodeEs from "./App.es.vue?raw";
import appSolutionCodeEn from "./App.solution.en.vue?raw";
import appSolutionCodeEs from "./App.solution.es.vue?raw";
import quantityStepperCodeEn from "./QuantityStepper.en.vue?raw";
import quantityStepperCodeEs from "./QuantityStepper.es.vue?raw";
import solutionCodeEn from "./QuantityStepper.solution.en.vue?raw";
import solutionCodeEs from "./QuantityStepper.solution.es.vue?raw";
import testCodeEn from "./QuantityStepper.test.en.ts?raw";
import testCodeEs from "./QuantityStepper.test.es.ts?raw";

const localizedFiles = {
  en: {
    appCode: appCodeEn,
    appSolutionCode: appSolutionCodeEn,
    quantityStepperCode: quantityStepperCodeEn,
    solutionCode: solutionCodeEn,
    testCode: testCodeEn,
  },
  es: {
    appCode: appCodeEs,
    appSolutionCode: appSolutionCodeEs,
    quantityStepperCode: quantityStepperCodeEs,
    solutionCode: solutionCodeEs,
    testCode: testCodeEs,
  },
};

export function createPropsEmitsQuantityStepperChallenge(locale: string): WebContainerChallenge {
  const files = locale === "en" ? localizedFiles.en : localizedFiles.es;

  return {
    id: "props-emits-quantity-stepper",
    files: [
      {
        content: files.quantityStepperCode,
        editable: true,
        icon: "vue",
        label: "QuantityStepper.vue",
        path: "src/QuantityStepper.vue",
        solution: files.solutionCode,
      },
      {
        content: files.appCode,
        editable: true,
        icon: "vue",
        label: "App.vue",
        path: "src/App.vue",
        preview: true,
        solution: files.appSolutionCode,
      },
      {
        content: files.testCode,
        editable: false,
        icon: "test",
        label: "QuantityStepper.test.ts",
        path: "src/QuantityStepper.test.ts",
      },
    ],
  };
}
