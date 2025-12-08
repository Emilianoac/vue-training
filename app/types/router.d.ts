import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    menu?: boolean;
    titleKey?: string;
  }
}