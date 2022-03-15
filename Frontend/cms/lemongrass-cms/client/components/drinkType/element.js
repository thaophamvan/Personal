import i18n from 'i18next'
/*eslint-disable */
export function getElement() {
  const model = [
    {
      key: 'name', label: i18n.t('NAME'), type: 'text', props: { required: true },
    },
    {
      key: 'type', label: i18n.t('TYPE'), type: 'text', props: { required: true },
    },
    {
      key: 'description', label: i18n.t('DESCRIPTION'), type: 'text', props: { required: true },
    },
    {
      key: 'height', label: i18n.t('HEIGHT'), type: 'text', props: { required: true },
    },
    {
      key: 'diameter', label: i18n.t('DIAMETER'), type: 'text', props: { required: true },
    },
    {
      key: 'volume', label: i18n.t('VOLUME'), type: 'text', props: { required: true },
    },
  ]
  return model
}
