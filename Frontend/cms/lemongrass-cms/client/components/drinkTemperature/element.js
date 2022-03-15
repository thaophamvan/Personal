import i18n from 'i18next'
/*eslint-disable */
export function getElement() {
  const model = [
    {
      key: 'name', label: i18n.t('NAME'), type: 'text', props: { required: true },
    },
    {
      key: 'description', label: i18n.t('DESCRIPTION'), type: 'text', props: { required: true },
    },
    {
      key: 'desired_temperature', label: i18n.t('DESIRED_TEMPERATURE'), type: 'text', props: { required: true },
    },
  ]
  return model
}
