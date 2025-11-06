export const legalAreas = [
  'Trabalhista',
  'Família e Sucessões',
  'Cível',
  'Consumidor',
  'Previdenciário',
  'Criminal',
  'Imobiliário',
  'Empresarial'
];

export const legalQuickReplies: { label: string; text: string }[] = [
  {
    label: 'Triagem inicial',
    text:
      'Para iniciarmos a triagem, me informe por favor: nome completo, CPF/CNPJ, área do direito envolvida e um breve resumo do caso (com datas).'
  },
  {
    label: 'Docs básicos',
    text:
      'Poderia enviar fotos dos documentos relacionados (RG/CPF, comprovante de residência e documentos do caso)? Pode ser em foto pelo WhatsApp.'
  },
  {
    label: 'Encaminhar advogado',
    text:
      'Vou direcionar seu caso a um(a) advogado(a) especialista na área. Podemos agendar uma consulta? Informe melhor dia/horário.'
  },
  {
    label: 'Honorários',
    text:
      'Os honorários serão definidos após a análise inicial, conforme complexidade e urgência. Enviaremos a proposta por escrito para sua concordância.'
  }
];

export interface LegalTriageData {
  fullName: string;
  documentId?: string;
  phone?: string;
  area: string;
  summary: string;
  hasProcessNumber: boolean;
  processNumber?: string;
}

