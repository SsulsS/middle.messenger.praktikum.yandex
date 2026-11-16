import Handlebars from 'handlebars';

const compiledTemplates = new Map<string, HandlebarsTemplateDelegate>();

export const compileTemplate = (
  template: string,
  context: Record<string, unknown>
): string => {
  const cachedTemplate = compiledTemplates.get(template);

  if (cachedTemplate) {
    return cachedTemplate(context);
  }

  const compiledTemplate = Handlebars.compile(template);

  compiledTemplates.set(template, compiledTemplate);

  return compiledTemplate(context);
};
