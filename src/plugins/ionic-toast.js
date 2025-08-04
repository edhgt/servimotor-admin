import { toastController } from '@ionic/vue'

export async function showToast(options = {}) {
  const toast = await toastController.create({
    message: options.message || 'Mensaje',
    duration: options.duration || 2000,
    color: options.color || 'primary',
    position: options.position || 'bottom',
    buttons: options.buttons || undefined,
  })

  await toast.present()
}
