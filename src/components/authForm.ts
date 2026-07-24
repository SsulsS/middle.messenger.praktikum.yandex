import Handlebars from "handlebars";
import template from "./AuthForm.hbs?raw";

export interface AuthField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autocomplete?: string;
}

export interface AuthFormConfig {
  pageClass: string;
  containerClass?: string;
  title: string;
  fields: AuthField[];
  submitText: string;
  link?: {
    href: string;
    text: string;
  };
}

export function renderAuthForm(config: AuthFormConfig): string {
  const templateFn = Handlebars.compile(template);
  return templateFn(config);
}
