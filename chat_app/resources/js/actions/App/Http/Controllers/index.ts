import HomeController from './HomeController'
import Auth from './Auth'
import Settings from './Settings'
const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
Auth: Object.assign(Auth, Auth),
Settings: Object.assign(Settings, Settings),
}

export default Controllers