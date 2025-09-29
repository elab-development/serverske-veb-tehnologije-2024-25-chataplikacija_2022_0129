import MessageController from './MessageController'
import ConversationController from './ConversationController'
import HomeController from './HomeController'
import Auth from './Auth'
import Settings from './Settings'
const Controllers = {
    MessageController: Object.assign(MessageController, MessageController),
ConversationController: Object.assign(ConversationController, ConversationController),
HomeController: Object.assign(HomeController, HomeController),
Auth: Object.assign(Auth, Auth),
Settings: Object.assign(Settings, Settings),
}

export default Controllers