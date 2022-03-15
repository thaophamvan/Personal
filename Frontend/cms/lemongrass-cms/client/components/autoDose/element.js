import i18n from 'i18next'
/*eslint-disable */
export function getElement() {
  const model = [
    {
      key: 'status', label: i18n.t('STATUS'), type: 'text', props: { required: true },
    },
    {
      key: 'type', label: i18n.t('TYPE'), type: 'text', props: { required: true },
    },
    {
      key: 'name', label: i18n.t('NAME'), type: 'text', props: { required: true },
    },
    {
      key: 'company', label: i18n.t('COMPANY'), type: 'text', props: { required: true },
    },
    {
      key: 'standard_packaging_size', label: i18n.t('STANDARD_PACKAGING_SIZE'), type: 'text', props: { required: true },
    },
    {
      key: 'countries', label: i18n.t('COUNTRIES_AVAILABLE'), type: 'text', props: { required: true },
    },
    {
      key: 'pnc', label: i18n.t('PNC'), type: 'text', props: { required: true },
    },
    {
      key: 'dosing_amount', label: i18n.t('DOSING_AMOUNT'), type: 'text', props: { required: true },
    },
    {
      key: 'image', label: i18n.t('IMAGE'), type: 'text', props: { required: true },
    },
    {
      key: 'purchase_link', label: i18n.t('PURCHASE_LINK'), type: 'text', props: { required: true },
    },
  ]
  return model
}
