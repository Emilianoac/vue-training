import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error Archivo virtual montado por el challenge runner. Ejemplo: src/Component.vue.
import App from "./App.vue";
// @ts-expect-error Archivo virtual montado por el challenge runner. Ejemplo: src/Component.vue.
import BasePanel from "./BasePanel.vue";

describe("BasePanel.vue", () => {
  it("muestra el contenido de respaldo del encabezado", () => {
    const wrapper = mount(BasePanel);

    expect(wrapper.get('[data-testid="panel-header"]').text()).toBe("Panel");
  });

  it("distribuye el contenido en las tres regiones", () => {
    const wrapper = mount(BasePanel, {
      slots: {
        default: "<p>Contenido principal</p>",
        header: "<h2>Encabezado personalizado</h2>",
        actions: "<button>Continuar</button>",
      },
    });

    expect(wrapper.get('[data-testid="panel-header"]').text()).toBe("Encabezado personalizado");
    expect(wrapper.get('[data-testid="panel-content"]').text()).toBe("Contenido principal");
    expect(wrapper.get('[data-testid="panel-actions"]').text()).toBe("Continuar");
  });
});

describe("App.vue", () => {
  it("completa el panel desde el componente padre", () => {
    const wrapper = mount(App);
    const header = wrapper.get('[data-testid="panel-header"]');
    const actions = wrapper.get('[data-testid="panel-actions"]');

    expect(header.get('[data-testid="profile-title"]').text()).toBe("Perfil de Ana");
    expect(wrapper.get('[data-testid="profile-description"]').text()).toContain(
      "Revisa la información",
    );
    expect(actions.get('[data-testid="cancel-button"]').text()).toBe("Cancelar");
    expect(actions.get('[data-testid="save-button"]').text()).toBe("Guardar");
  });
});
