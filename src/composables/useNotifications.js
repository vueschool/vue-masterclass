import { reactive } from 'vue'
const notifications = reactive([])
const addNotification = (notification) => {
  notifications.push({
    id: Math.random() + Date.now(),
    ...notification
  })
}

const removeNotification = (id) => {
  const index = notifications.findIndex(item => item.id === id)
  notifications.splice(index, 1)
}
export default function useNotifications () {
  return { notifications, addNotification, removeNotification }
}
