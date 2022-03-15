import DefaultLayout from '../layouts/defaultLayout'
import Home from '../components/home'
import DrinkTypeRoute from '../containers/drinkType'
import DrinkTypeNewRoute from '../components/drinkType/drinkTypeNewForm'
import DrinkTypeEditRoute from '../components/drinkType/drinkTypeEditForm'
import DrinkTemperatureRoute from '../containers/drinkTemperature'
import DrinkTemperatureNewRoute from '../components/drinkTemperature/drinkTemperatureNewForm'
import DrinkTemperatureEditRoute from '../components/drinkTemperature/drinkTemperatureEditForm'

export default [
  {
    layout: DefaultLayout,
    routes: [
      {
        path: '/',
        component: Home,
        exact: true,
      },
      {
        path: '/drink-type',
        component: DrinkTypeRoute,
        exact: true,
      },
      {
        path: '/drink-type/new',
        component: DrinkTypeNewRoute,
      },
      {
        path: '/drink-type/:id/edit',
        component: DrinkTypeEditRoute,
      },
      {
        path: '/drink-temperature',
        component: DrinkTemperatureRoute,
        exact: true,
      },
      {
        path: '/drink-temperature/new',
        component: DrinkTemperatureNewRoute,
        exact: true,
      },
      {
        path: '/drink-temperature/:id/edit',
        component: DrinkTemperatureEditRoute,
        exact: true,
      },
    ],
  },
]
